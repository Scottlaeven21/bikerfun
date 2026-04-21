/**
 * Redirect fallback – [category]/page.tsx handles all /products/[x] traffic.
 * Next.js picks [category] over [slug] alphabetically, so this is rarely hit,
 * but if it is we just delegate to the same logic to avoid a 500.
 */
import { redirect } from 'next/navigation';

export default async function SlugFallback({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
