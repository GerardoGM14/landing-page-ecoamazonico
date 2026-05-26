import { useRef, useState } from 'react';
import ImageUploader from './ImageUploader';
import { uploadImage } from '../../lib/uploadImage';

interface Props {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  path: string;
  hint?: string;
  aspect?: string;
}

export default function ImageListEditor({ label, value, onChange, path, hint, aspect = '4/3' }: Props) {
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; errors: number } | null>(null);

  function update(idx: number, url: string) {
    onChange(value.map((v, i) => (i === idx ? url : v)));
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...value, '']);
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  }

  async function handleBulkFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    setBulkProgress({ done: 0, total: arr.length, errors: 0 });

    const settled = await Promise.all(arr.map((f) => uploadImage(f, path)));

    const successful = settled.filter((r): r is { ok: true; url: string } => r.ok).map((r) => r.url);
    const errorCount = settled.length - successful.length;

    onChange([...value, ...successful]);
    setBulkProgress({ done: successful.length, total: arr.length, errors: errorCount });

    setTimeout(() => setBulkProgress(null), 2500);
  }

  function onBulkPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleBulkFiles(e.target.files);
    e.target.value = '';
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => bulkInputRef.current?.click()}
            disabled={!!bulkProgress}
            className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition disabled:opacity-50"
          >
            + Subir varias
          </button>
          <button
            type="button"
            onClick={add}
            disabled={!!bulkProgress}
            className="text-[11px] uppercase tracking-[0.15em] text-gray-600 hover:text-black px-2 py-1 cursor-pointer font-medium transition disabled:opacity-50"
          >
            + Una
          </button>
        </div>
      </div>

      <input
        ref={bulkInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onBulkPick}
        className="hidden"
      />

      {bulkProgress && (
        <div className="mb-3 border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
          {bulkProgress.done < bulkProgress.total ? (
            <span className="text-gray-600">Subiendo {bulkProgress.total} archivos…</span>
          ) : (
            <span className={bulkProgress.errors > 0 ? 'text-orange-600' : 'text-green-700'}>
              {bulkProgress.done} subidas
              {bulkProgress.errors > 0 && ` · ${bulkProgress.errors} con error`}
            </span>
          )}
        </div>
      )}

      {value.length === 0 ? (
        <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
          No hay imágenes. Usa “+ Subir varias” para cargar todas a la vez.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute top-1 left-1 z-10 bg-white/95 text-black text-[10px] font-mono px-1.5 py-0.5 shadow-sm">
                #{idx + 1}
              </div>
              <ImageUploader
                label=""
                value={url}
                onChange={(u) => update(idx, u)}
                path={path}
                aspect={aspect}
              />
              <div className="mt-1 flex items-center justify-end gap-0.5">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Atrás"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === value.length - 1}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Adelante"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hint && <p className="mt-3 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
