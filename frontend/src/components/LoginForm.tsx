import { useEffect, useState, type FormEvent } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
} from 'firebase/auth';
import { getFirebase } from '../lib/firebase';
import { isAdmin } from '../lib/admins';
import { useAuth } from '../lib/useAuth';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests':
    'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.',
  'auth/network-request-failed':
    'No se pudo conectar. Revisa tu conexión a internet.',
};

export default function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.status === 'authenticated') {
      window.location.replace('/dashboard');
    }
  }, [auth.status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Completa tu correo y contraseña.');
      return;
    }

    if (!isAdmin(email.trim())) {
      setError('Esta cuenta no tiene permisos de administrador.');
      return;
    }

    setSubmitting(true);
    try {
      const { auth: fbAuth } = getFirebase();
      const cred = await signInWithEmailAndPassword(
        fbAuth,
        email.trim(),
        password
      );

      if (!isAdmin(cred.user.email)) {
        await signOut(fbAuth);
        setError('Esta cuenta no tiene permisos de administrador.');
        setSubmitting(false);
        return;
      }
      window.location.replace('/dashboard');
    } catch (err) {
      const code = (err as AuthError)?.code ?? '';
      setError(ERROR_MESSAGES[code] ?? 'No se pudo iniciar sesión. Intenta de nuevo.');
      setSubmitting(false);
    }
  }

  if (auth.status === 'loading' || auth.status === 'authenticated') {
    return (
      <div className="grid place-items-center py-16">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-eco-lime animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {auth.status === 'unauthorized' && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
          Tu cuenta ({auth.user.email}) no tiene permisos. Inicia sesión con
          una cuenta autorizada.
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          placeholder="tu@correo.com"
          className="w-full rounded-lg bg-white/5 border border-white/15 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-eco-lime focus:ring-2 focus:ring-eco-lime/30 transition disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            placeholder="••••••••"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-4 py-2.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-eco-lime focus:ring-2 focus:ring-eco-lime/30 transition disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-eco-lime transition cursor-pointer"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-eco-lime text-green-950 font-bold py-3 rounded-full hover:bg-white transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-green-950/30 border-t-green-950 animate-spin" />
            Iniciando sesión…
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  );
}
