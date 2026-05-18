import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { getFirebase } from './firebase';
import { isAdmin } from './admins';

export type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'unauthorized'; user: User }
  | { status: 'authenticated'; user: User };

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    const { auth } = getFirebase();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setState({ status: 'unauthenticated' });
      } else if (!isAdmin(user.email)) {
        setState({ status: 'unauthorized', user });
      } else {
        setState({ status: 'authenticated', user });
      }
    });
    return unsub;
  }, []);

  return state;
}

export async function logout() {
  const { auth } = getFirebase();
  await signOut(auth);
}
