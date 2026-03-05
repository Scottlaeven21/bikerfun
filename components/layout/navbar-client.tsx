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
  const [mounted, setMounted] = useState(false);
  const { getTotalItems, hydrate, items } = useCart();

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // Update cart count when items change
  useEffect(() => {
    if (mounted) {
      setCartCount(getTotalItems());
    }
  }, [items, getTotalItems, mounted]);

  return <Navbar user={user} isAdmin={isAdmin} cartItemCount={cartCount} />;
}
