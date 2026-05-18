import { useEffect, useState } from 'react';
import { collection as col, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getFirebase } from './firebase';

export function useFirestoreCollection<T>(
  collectionName: string,
  fallback: T[],
  orderField = 'order'
): T[] {
  const [data, setData] = useState<T[]>(fallback);

  useEffect(() => {
    const { db } = getFirebase();
    const q = query(col(db, collectionName), orderBy(orderField));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
        if (items.length > 0) setData(items);
      },
      (err) => {
        console.warn(`[useFirestoreCollection] ${collectionName} subscription error`, err);
      }
    );
    return unsub;
  }, [collectionName, orderField]);

  return data;
}
