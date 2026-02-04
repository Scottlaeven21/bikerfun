'use client';

import { useCart } from '@/hooks/use-cart';
import { Navbar } from './navbar';

interface NavbarClientProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
}

export function NavbarClient({ user, isAdmin }: NavbarClientProps) {
  const { getTotalItems } = useCart();
  return <Navbar user={user} isAdmin={isAdmin} cartItemCount={getTotalItems()} />;
}
