export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black noise-overlay px-4 pt-28">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
