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
      <div className="grid place-items-center py-12">
        <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {auth.status === 'unauthorized' && (
        <div className="rounded-md bg-red-50 border-l-2 border-red-500 px-4 py-3 text-sm text-red-900">
          Tu cuenta ({auth.user.email}) no tiene permisos. Inicia sesión con
          una cuenta autorizada.
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium mb-2"
        >
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
          className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition disabled:opacity-50"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium"
          >
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
            className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition cursor-pointer font-medium"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          placeholder="••••••••"
          className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border-l-2 border-red-500 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="group relative w-full bg-black text-white font-medium py-3.5 px-6 hover:bg-gray-900 transition-all duration-200 flex items-center justify-between gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
      >
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-eco-lime transition-all duration-200 group-hover:w-2 group-disabled:w-1"></span>
        <span className="pl-2 text-sm tracking-wide uppercase">
          {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </span>
        {submitting ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  );
}
