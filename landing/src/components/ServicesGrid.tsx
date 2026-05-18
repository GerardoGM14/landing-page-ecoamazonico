import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../lib/useFirestoreCollection';
import type { Service } from '../lib/types';

const iconMap: Record<string, React.ReactNode> = {
  clipboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  truck: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  key: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
};

interface Props {
  fallback: Service[];
}

export default function ServicesGrid({ fallback }: Props) {
  const services = useFirestoreCollection<Service>('services', fallback);
  const [modal, setModal] = useState<{ title: string; desc: string } | null>(null);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal]);

  const handleQuote = (title: string) => {
    setModal(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    setTimeout(() => {
      const message = `Hola, quisiera más información y cotizar el servicio de: ${title}`;
      window.dispatchEvent(new CustomEvent('open-whatsapp-chat', { detail: { message } }));
    }, 800);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl border border-gray-200 flex flex-col h-full group hover:border-eco-lime transition-colors duration-300">
            <div className="relative h-48">
              <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              </div>
              <div className="absolute -bottom-6 left-6 bg-eco-lime p-3 rounded-full text-green-950 border-4 border-white z-10 flex items-center justify-center">
                {iconMap[service.icon] ?? iconMap.clipboard}
              </div>
            </div>
            <div className="pt-10 pb-6 px-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-6 line-clamp-4 flex-grow">{service.fullDesc}</p>
              <button
                type="button"
                onClick={() => setModal({ title: service.title, desc: service.fullDesc })}
                className="text-green-900 font-bold text-sm flex items-center gap-2 hover:text-eco-lime transition-colors group/btn cursor-pointer"
              >
                Más detalles
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
            onClick={() => setModal(null)}
          />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-eco-lime/10 sm:mx-0 sm:h-10 sm:w-10 text-green-950">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <h3 className="text-xl font-bold leading-6 text-gray-900">{modal.title}</h3>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">{modal.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuote(modal.title)}
                    className="inline-flex w-full justify-center rounded-md bg-eco-lime text-green-950 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-eco-lime/80 sm:mr-3 sm:w-auto cursor-pointer"
                  >
                    Cotizar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
