import { useEffect } from 'react';

interface Props {
  message: string;
  variant?: 'success' | 'error';
  onDone: () => void;
  durationMs?: number;
}

export default function Toast({ message, variant = 'success', onDone, durationMs = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);

  const isSuccess = variant === 'success';
  return (
    <div className="fixed bottom-24 right-4 md:right-8 z-50 animate-[slideIn_0.2s_ease-out]">
      <div className={`bg-black text-white border-l-2 ${isSuccess ? 'border-eco-lime' : 'border-red-500'} pl-4 pr-5 py-3 shadow-2xl flex items-center gap-3 min-w-[260px]`}>
        {isSuccess ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-eco-lime flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
