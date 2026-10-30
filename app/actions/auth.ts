'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { logAuditEvent } from '@/lib/audit/logger';
import {
  clearAdmin2faCookie,
  setAdmin2faCookie,
  shouldSkipAdmin2fa,
} from '@/lib/auth/admin-2fa';
import { passwordChangePath } from '@/lib/auth/must-change-password';

function portalHome(isAdmin: boolean, isDealer: boolean) {
  if (isAdmin) return '/admin';
  if (isDealer) return '/dealer';
  return '/account';
}

function resolveLoginRedirect(redirectTo: string, isAdmin: boolean, isDealer: boolean) {
  const home = portalHome(isAdmin, isDealer);
  const requested = redirectTo.startsWith('/') ? redirectTo : '/';
  if (isAdmin && requested.startsWith('/admin')) return requested;
  if (!isAdmin && isDealer && requested.startsWith('/dealer')) return requested;
  if (!isAdmin && !isDealer && (requested.startsWith('/account') || requested.startsWith('/dashboard'))) {
    return requested;
  }
  return home;
}

async function siteUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const proto = requestHeaders.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  if (host) return `${proto}://${host}`;
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl').replace(/\/$/, '');
}

function loginTarget(path: string) {
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/dealer')) return 'dealer';
  if (path.startsWith('/account') || path.startsWith('/dashboard')) return 'webshop_account';
  return 'shop';
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/';

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
      details: { success: false, error: error.message, redirect: redirectTo, target: loginTarget(redirectTo) },
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
  let mustChangePassword = false;
  if (data.user?.id) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('is_admin, is_dealer, must_change_password')
      .eq('id', data.user.id)
      .single();
    isAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin);
    isDealer = Boolean((profile as { is_dealer?: boolean } | null)?.is_dealer);
    mustChangePassword = Boolean((profile as { must_change_password?: boolean } | null)?.must_change_password);
  }

  const next = resolveLoginRedirect(redirectTo, isAdmin, isDealer);

  await logAuditEvent({
    userId: data.user?.id,
    userEmail: email,
    action: 'login',
    resourceType: 'user',
    details: { success: true, redirect: next, target: loginTarget(next), is_admin: isAdmin, is_dealer: isDealer, step: 'password' },
  });

  if (mustChangePassword && data.user?.id) {
    revalidatePath('/', 'layout');
    redirect(passwordChangePath(next));
  }

  if (isAdmin && data.user?.id) {
    if (shouldSkipAdmin2fa()) {
      await setAdmin2faCookie(data.user.id);
    } else {
      revalidatePath('/', 'layout');
      redirect(`/login/verify?redirect=${encodeURIComponent(next)}`);
    }
  }

  revalidatePath('/', 'layout');
  redirect(next);
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

export async function changeForcedPassword(prevState: { error?: string } | null, formData: FormData) {
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');
  const redirectTo = String(formData.get('redirect') || '/');
  const next = redirectTo.startsWith('/') ? redirectTo : '/';

  if (password.length < 8) {
    return { error: 'Gebruik minimaal 8 tekens.' };
  }
  if (password !== confirm) {
    return { error: 'De wachtwoorden komen niet overeen.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Sessie verlopen. Log opnieuw in.' };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: 'Wachtwoord wijzigen mislukt. Kies een sterker wachtwoord.' };
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .update({ must_change_password: false, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select('is_admin, is_dealer')
    .maybeSingle();

  const destination = resolveLoginRedirect(
    next,
    Boolean(profile?.is_admin),
    Boolean(profile?.is_dealer)
  );

  revalidatePath('/', 'layout');
  if (profile?.is_admin) {
    redirect(`/login/verify?redirect=${encodeURIComponent(destination)}`);
  }
  redirect(destination);
}

export async function requestPasswordReset(prevState: { error?: string; success?: string } | null, formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Vul een geldig e-mailadres in.' };
  }

  const supabase = await createClient();
  const redirectTo = `${await siteUrl()}/auth/callback?next=/login/reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    console.error('Password reset request failed:', error.message);
    return { error: 'Resetmail versturen is nu niet gelukt. Probeer het zo opnieuw.' };
  }

  return {
    success: 'Als dit e-mailadres bij ons bekend is, sturen we een mail met een link om je wachtwoord te resetten.',
  };
}

export async function resetForgottenPassword(prevState: { error?: string } | null, formData: FormData) {
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');

  if (password.length < 8) {
    return { error: 'Gebruik minimaal 8 tekens.' };
  }
  if (password !== confirm) {
    return { error: 'De wachtwoorden komen niet overeen.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Deze resetlink is ongeldig of verlopen. Vraag een nieuwe aan.' };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: 'Wachtwoord wijzigen mislukt. Kies een sterker wachtwoord.' };
  }

  await (supabase as any)
    .from('profiles')
    .update({ must_change_password: false, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login?reset=ok');
}
