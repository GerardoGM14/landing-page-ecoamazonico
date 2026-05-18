import { useEffect } from 'react';
import { useAuth } from '../lib/useAuth';

export default function RootRedirect() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === 'loading') return;
    if (auth.status === 'authenticated') {
      window.location.replace('/dashboard');
    } else {
      window.location.replace('/login');
    }
  }, [auth.status]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-eco-lime animate-spin" />
        <p className="text-sm">Cargando…</p>
      </div>
    </div>
  );
}
