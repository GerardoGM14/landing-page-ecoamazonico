import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  images: string[];
}

export default function IsoCertModal({ open, onClose, images }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, images.length, onClose]);

  if (!open) return null;

  const hasImages = images.length > 0;
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[120] flex flex-col">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-default"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="bg-eco-lime text-green-950 px-3 py-1 rounded-sm text-xs md:text-sm font-bold uppercase tracking-wide">
            Certificaciones ISO
          </span>
          {hasImages && (
            <span className="text-sm text-gray-400">
              {index + 1} / {images.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-300 hover:text-eco-lime transition-colors p-2 -mr-2 cursor-pointer"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main viewer */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-16 min-h-0">
        {!hasImages ? (
          <p className="text-gray-400 text-sm">No hay certificaciones cargadas todavía.</p>
        ) : (
          <>
            {images.length > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 md:left-6 z-20 bg-white/10 hover:bg-eco-lime hover:text-green-950 text-white rounded-full p-2 md:p-3 transition cursor-pointer"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <img
              src={images[index]}
              alt={`Certificación ISO ${index + 1}`}
              className="max-h-full max-w-full object-contain select-none"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute right-2 md:right-6 z-20 bg-white/10 hover:bg-eco-lime hover:text-green-950 text-white rounded-full p-2 md:p-3 transition cursor-pointer"
                aria-label="Siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3 px-4 py-4 md:py-6 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-md overflow-hidden border-2 transition cursor-pointer bg-white/5 ${
                i === index
                  ? 'border-eco-lime opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
              aria-label={`Ver certificación ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
