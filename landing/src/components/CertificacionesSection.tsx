import { useState } from 'react';
import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { CertificacionesContent } from '../lib/types';
import IsoCertModal from './IsoCertModal';

interface Props {
  fallback: CertificacionesContent;
}

export default function CertificacionesSection({ fallback }: Props) {
  const data = useFirestoreDoc<CertificacionesContent>('siteContent', 'certificaciones', fallback);
  const [isoOpen, setIsoOpen] = useState(false);

  const isoImages = data.isoImages ?? [];
  const isoLabel = data.isoButtonLabel || 'Ver Certificaciones ISO';

  return (
    <>
      {/* Background Image (absolute, will fill parent section) */}
      <div className="absolute inset-0 z-0">
        {data.backgroundUrl && (
          <img src={data.backgroundUrl} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Main content */}
          <div className="lg:col-span-8">
            <span className="bg-eco-lime text-green-950 px-3 py-1 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide inline-block mb-4">
              {data.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 leading-tight max-w-2xl">
              {data.title}
            </h2>

            <div className="grid grid-cols-1 gap-10 md:gap-12">
              {data.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row items-stretch gap-3 md:gap-4 ${idx % 2 === 1 ? 'md:pl-16' : ''}`}
                >
                  <div className="shrink-0 w-28 md:w-64 flex items-center justify-end">
                    {item.logoUrl && (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="w-full h-full object-contain object-right"
                      />
                    )}
                  </div>
                  <div className="max-w-xl">
                    <div className="h-full border-l-2 border-gray-500 pl-4 md:pl-6 py-2 flex items-center">
                      <p className="text-gray-300 text-xs md:text-base leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isoImages.length > 0 && (
              <div className="mt-10 md:mt-12">
                <button
                  type="button"
                  onClick={() => setIsoOpen(true)}
                  className="bg-eco-lime text-green-950 px-6 py-3 rounded-sm text-base md:text-lg font-bold uppercase tracking-wide hover:bg-white hover:text-green-900 transition duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{isoLabel}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: decorative badge (not editable) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 md:w-64 md:h-64 hidden md:flex items-center justify-center">
              <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-eco-lime fill-current opacity-80">
                  <path
                    id="cert-curve"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text fontSize="10.5" fontWeight="bold" letterSpacing="1.5">
                    <textPath href="#cert-curve">• GARANTÍA • CALIDAD • CONFIANZA</textPath>
                  </text>
                </svg>
              </div>
              <div className="relative z-10 bg-eco-lime/10 p-4 rounded-full backdrop-blur-sm border border-eco-lime/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-eco-lime"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <IsoCertModal open={isoOpen} onClose={() => setIsoOpen(false)} images={isoImages} />
    </>
  );
}
