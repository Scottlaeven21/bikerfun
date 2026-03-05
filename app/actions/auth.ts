'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/audit/logger';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect') as string || '/';

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
      details: { success: false, error: error.message },
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

  // Log successful login
  await logAuditEvent({
    userId: data.user?.id,
    userEmail: email,
    action: 'login',
    resourceType: 'user',
    details: { success: true },
  });

  revalidatePath('/', 'layout');
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
