import { useEffect } from 'react';
import { useAuth, type AuthState } from './useAuth';

export function useRequireAuth(): AuthState {
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === 'unauthenticated' || auth.status === 'unauthorized') {
      window.location.replace('/login');
    }
  }, [auth.status]);

  return auth;
}
