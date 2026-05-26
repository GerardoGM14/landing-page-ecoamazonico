import { useRef, useState } from 'react';
import { uploadImage, MAX_IMAGE_SIZE_MB } from '../../lib/uploadImage';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Path inside the bucket, e.g. "site/services". Filename is added automatically. */
  path: string;
  hint?: string;
  /** Aspect ratio for preview, e.g. "16/9", "4/3", "1/1". Default "16/9". */
  aspect?: string;
}

export default function ImageUploader({ label, value, onChange, path, hint, aspect = '16/9' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setProgress(40);

    const result = await uploadImage(file, path);

    if (result.ok) {
      setProgress(100);
      onChange(result.url);
    } else {
      setError(result.error);
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 400);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      {label && (
        <span className="block text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium mb-2">{label}</span>
      )}

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border border-gray-200 bg-gray-50 overflow-hidden group"
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="bg-white text-black text-xs uppercase tracking-[0.15em] px-4 py-2 font-medium hover:bg-eco-lime transition cursor-pointer disabled:opacity-60"
              >
                Cambiar imagen
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 grid place-items-center text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer disabled:cursor-wait"
          >
            <div className="text-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.15em] font-medium">Subir o arrastrar</p>
              <p className="text-[10px] mt-0.5 text-gray-400 normal-case tracking-normal">máx {MAX_IMAGE_SIZE_MB}MB</p>
            </div>
          </button>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/85 grid place-items-center">
            <div className="text-center w-3/4 max-w-xs">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-600 font-medium mb-2">Subiendo…</p>
              <div className="h-1 bg-gray-200 overflow-hidden">
                <div className="h-full bg-eco-lime transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {!error && hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
