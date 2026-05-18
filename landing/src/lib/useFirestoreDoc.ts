import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFirebase } from './firebase';

export function useFirestoreDoc<T>(collection: string, docId: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    const { db } = getFirebase();
    const ref = doc(db, collection, docId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setData(snap.data() as T);
      },
      (err) => {
        console.warn(`[useFirestoreDoc] ${collection}/${docId} subscription error`, err);
      }
    );
    return unsub;
  }, [collection, docId]);

  return data;
}
