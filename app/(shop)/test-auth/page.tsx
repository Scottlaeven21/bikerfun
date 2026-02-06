import { createClient } from '@/lib/supabase/server';

export default async function TestAuthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-white pt-40 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Auth Test Pagina</h1>
        
        <div className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray">
          <h2 className="text-2xl font-bold mb-4">User Status:</h2>
          {user ? (
            <div className="space-y-3">
              <p className="text-green-400 font-bold">✅ Je bent ingelogd!</p>
              <div className="bg-biker-black p-4 rounded">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Created:</strong> {new Date(user.created_at || '').toLocaleString('nl-NL')}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-400 font-bold">❌ Je bent NIET ingelogd</p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <a href="/account" className="block bg-biker-yellow text-biker-black px-6 py-3 rounded-full font-bold text-center">
            Ga naar Account Pagina
          </a>
          <a href="/login" className="block bg-white text-black px-6 py-3 rounded-full font-bold text-center">
            Ga naar Login Pagina
          </a>
          <a href="/" className="block bg-biker-gray text-white px-6 py-3 rounded-full font-bold text-center">
            Terug naar Home
          </a>
        </div>
      </div>
    </div>
  );
}
