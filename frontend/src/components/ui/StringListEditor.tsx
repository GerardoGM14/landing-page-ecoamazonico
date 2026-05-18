interface Props {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hint?: string;
  emptyLabel?: string;
}

export default function StringListEditor({ label, value, onChange, placeholder, hint, emptyLabel = 'Sin elementos' }: Props) {
  function update(idx: number, val: string) {
    onChange(value.map((v, i) => (i === idx ? val : v)));
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
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
        >
          + Agregar
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-gray-300 px-4 py-6 text-center text-xs text-gray-400">
          {emptyLabel}
        </div>
      ) : (
        <ul className="space-y-2">
          {value.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2">
              <span className="text-[10px] font-mono text-gray-400 w-5 flex-shrink-0">{idx + 1}</span>
              <input
                type="text"
                value={item}
                onChange={(e) => update(idx, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-black placeholder-gray-400 focus:outline-none min-w-0"
              />
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Mover arriba"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === value.length - 1}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Mover abajo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
            </li>
          ))}
        </ul>
      )}

      {hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
