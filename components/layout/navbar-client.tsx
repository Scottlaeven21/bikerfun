'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Navbar } from './navbar';

interface NavbarClientProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
}

export function NavbarClient({ user, isAdmin }: NavbarClientProps) {
  const { itemCount } = useCart();

  return <Navbar user={user} isAdmin={isAdmin} cartItemCount={itemCount} />;
}
