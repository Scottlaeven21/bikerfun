'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Navbar } from './navbar';

interface NavbarClientProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
}

export function NavbarClient({ user, isAdmin }: NavbarClientProps) {
  const [cartCount, setCartCount] = useState(0);
  const { getTotalItems } = useCart();

  useEffect(() => {
    setCartCount(getTotalItems());
  }, [getTotalItems]);

  return <Navbar user={user} isAdmin={isAdmin} cartItemCount={cartCount} />;
}
