import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebase } from './firebase';

export interface DocEditorResult<T> {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  update: <K extends keyof T>(key: K, value: T[K]) => void;
  dirty: boolean;
  saving: boolean;
  loading: boolean;
  save: () => Promise<{ ok: true } | { ok: false; error: string }>;
  discard: () => void;
  reload: () => Promise<void>;
}

export function useDocEditor<T extends object>(
  collection: string,
  docId: string,
  initial: T
): DocEditorResult<T> {
  const [original, setOriginal] = useState<T>(initial);
  const [draft, setDraft] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { db } = getFirebase();
    const snap = await getDoc(doc(db, collection, docId));
    if (snap.exists()) {
      const data = snap.data() as T;
      setOriginal(data);
      setDraft(data);
    } else {
      setOriginal(initial);
      setDraft(initial);
    }
  }

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [collection, docId]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(original), [draft, original]);

  function update<K extends keyof T>(key: K, value: T[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(): Promise<{ ok: true } | { ok: false; error: string }> {
    setSaving(true);
    try {
      const { db } = getFirebase();
      await setDoc(doc(db, collection, docId), draft);
      setOriginal(draft);
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, error: 'No se pudo guardar. Revisa tu conexión o permisos.' };
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    setDraft(original);
  }

  return { draft, setDraft, update, dirty, saving, loading, save, discard, reload: load };
}
