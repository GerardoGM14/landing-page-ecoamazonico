import ImageUploader from './ImageUploader';

interface Props {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  path: string;
  hint?: string;
  aspect?: string;
}

export default function ImageListEditor({ label, value, onChange, path, hint, aspect = '4/3' }: Props) {
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

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
        >
          + Agregar imagen
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
          No hay imágenes. Agrega la primera.
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((url, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="text-[10px] font-mono text-gray-400 w-5 pt-2 flex-shrink-0">#{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <ImageUploader
                  label=""
                  value={url}
                  onChange={(u) => update(idx, u)}
                  path={path}
                  aspect={aspect}
                />
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Subir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === value.length - 1}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Bajar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
