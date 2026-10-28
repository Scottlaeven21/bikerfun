'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/audit/logger';
import {
  clearAdmin2faCookie,
  issueAdmin2faCode,
  setAdmin2faCookie,
  shouldSkipAdmin2fa,
} from '@/lib/auth/admin-2fa';

function loginTarget(redirectTo: string) {
  const path = redirectTo || '/';
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/dealer')) return 'dealer';
  if (path.startsWith('/account') || path.startsWith('/dashboard')) return 'webshop_account';
  return 'shop';
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect') as string || '/';
  const target = loginTarget(redirectTo);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Log failed login attempt
    await logAuditEvent({
      userEmail: email,
      action: 'login',
      resourceType: 'user',
      details: { success: false, error: error.message, redirect: redirectTo, target },
    });
    
    // Translate common Supabase errors to Dutch
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid') || error.message.includes('credentials')) {
      return { error: 'Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'E-mailadres nog niet bevestigd. Check je inbox voor de verificatielink.' };
    }
    // Generic error
    return { error: 'Er is iets misgegaan bij het inloggen. Probeer het opnieuw.' };
  }

  let isAdmin = false;
  let isDealer = false;
  if (data.user?.id) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('is_admin, is_dealer')
      .eq('id', data.user.id)
      .single();
    isAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin);
    isDealer = Boolean((profile as { is_dealer?: boolean } | null)?.is_dealer);
  }

  await logAuditEvent({
    userId: data.user?.id,
    userEmail: email,
    action: 'login',
    resourceType: 'user',
    details: { success: true, redirect: redirectTo, target, is_admin: isAdmin, is_dealer: isDealer, step: 'password' },
  });

  if (isAdmin && data.user?.id) {
    if (shouldSkipAdmin2fa()) {
      await setAdmin2faCookie(data.user.id);
    } else {
      await issueAdmin2faCode(data.user.id, data.user.email || email, true);
      revalidatePath('/', 'layout');
      const next = redirectTo.startsWith('/') ? redirectTo : '/admin';
      redirect(`/login/verify?redirect=${encodeURIComponent(next)}`);
    }
  }

  revalidatePath('/', 'layout');
  if (!isAdmin && isDealer && (!redirectTo || redirectTo === '/')) {
    redirect('/dealer');
  }
  redirect(redirectTo);
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    // Log failed signup attempt
    await logAuditEvent({
      userEmail: email,
      action: 'create',
      resourceType: 'user',
      details: { success: false, error: error.message },
    });
    
    // Translate common Supabase errors to Dutch
    if (error.message.includes('already registered') || error.message.includes('User already registered')) {
      return { error: 'Dit e-mailadres is al in gebruik. Probeer in te loggen of gebruik een ander e-mailadres.' };
    }
    if (error.message.includes('password')) {
      return { error: 'Wachtwoord is te zwak. Gebruik minimaal 8 karakters met een hoofdletter, kleine letter en cijfer.' };
    }
    if (error.message.includes('email')) {
      return { error: 'Voer een geldig e-mailadres in.' };
    }
    // Generic error
    return { error: 'Er is iets misgegaan bij het aanmaken van je account. Probeer het opnieuw.' };
  }

  // Check if user was created or already exists
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    // User already exists but Supabase didn't return an error
    await logAuditEvent({
      userEmail: email,
      action: 'create',
      resourceType: 'user',
      details: { success: false, error: 'User already exists' },
    });
    return { error: 'Dit e-mailadres is al in gebruik. Probeer in te loggen of gebruik een ander e-mailadres.' };
  }

  // Log successful signup
  await logAuditEvent({
    userId: data.user?.id,
    userEmail: email,
    action: 'create',
    resourceType: 'user',
    details: { success: true, full_name: fullName },
  });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.auth.signOut();
  await clearAdmin2faCookie();

  // Log logout
  if (user) {
    await logAuditEvent({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action: 'logout',
      resourceType: 'user',
      details: { success: true },
    });
  }
  
  revalidatePath('/', 'layout');
  redirect('/');
}
