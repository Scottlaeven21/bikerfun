import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WhiteBackgroundWrapper>
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white px-4 pt-28">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
    </WhiteBackgroundWrapper>
  );
}
