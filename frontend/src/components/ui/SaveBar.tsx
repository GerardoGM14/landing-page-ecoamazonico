interface Props {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}

export default function SaveBar({ dirty, saving, onSave, onDiscard }: Props) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 bg-black text-white border-t-2 border-eco-lime transform transition-transform duration-300 ${
        dirty || saving ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-2 w-2 rounded-full bg-eco-lime animate-pulse" />
          <span className="text-gray-300">Tienes cambios sin guardar</span>
        </div>
        <div className="flex items-center gap-2">
          {onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              disabled={saving}
              className="text-xs uppercase tracking-[0.15em] text-gray-300 hover:text-white px-3 py-2 cursor-pointer disabled:opacity-50 font-medium"
            >
              Descartar
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="group relative bg-eco-lime text-black font-medium py-2.5 px-5 hover:bg-white transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="text-sm tracking-wide uppercase">{saving ? 'Guardando…' : 'Guardar cambios'}</span>
            {saving ? (
              <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
