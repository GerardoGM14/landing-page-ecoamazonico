import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}

const CLOSE_MS = 180;

export default function Modal({ open, onClose, title, eyebrow, children, footer, size = 'lg' }: Props) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const maxWidth = size === 'lg' ? 'max-w-3xl' : 'max-w-xl';
  const panelAnim = closing ? 'animate-[modalOut_0.18s_ease-in_forwards]' : 'animate-[modalIn_0.18s_ease-out]';
  const backdropAnim = closing ? 'animate-[fadeOut_0.18s_ease-in_forwards]' : 'animate-[fadeIn_0.18s_ease-out]';

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default ${backdropAnim}`}
      />
      <div className="relative h-full overflow-y-auto py-8 px-4">
        <div className={`relative mx-auto bg-white shadow-2xl ${maxWidth} ${panelAnim}`}>
          <div className="flex items-start justify-between px-6 md:px-8 py-5 border-b border-gray-100">
            <div className="min-w-0 pr-4">
              {eyebrow && (
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-medium mb-1">{eyebrow}</p>
              )}
              <h2 className="text-xl md:text-2xl font-bold text-black truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-2 -mr-2 text-gray-400 hover:text-black transition cursor-pointer"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 md:px-8 py-6 space-y-6">{children}</div>

          {footer && (
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
