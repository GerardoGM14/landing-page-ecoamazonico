import { useState, type ReactNode } from 'react';
import { useRequireAuth } from '../lib/useRequireAuth';
import { logout } from '../lib/useAuth';
import { SECTIONS, GROUP_LABELS, type Section } from '../lib/sections';
import SectionIcon from './SectionIcon';

interface Props {
  current?: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
}

const LANDING_URL = 'http://localhost:4321';

export default function AdminShell({ current, title, eyebrow, children }: Props) {
  const auth = useRequireAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (auth.status !== 'authenticated') {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  const grouped = SECTIONS.reduce<Record<Section['group'], Section[]>>(
    (acc, s) => {
      (acc[s.group] ??= []).push(s);
      return acc;
    },
    { inicio: [], servicios: [], global: [] }
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* TOPBAR */}
      <header className="sticky top-0 z-40 bg-black text-white border-b border-white/10">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden text-white p-1 -ml-1 cursor-pointer"
              aria-label="Abrir navegación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="/dashboard" className="flex items-center gap-3">
              <img src="/logo_ecoamazonico.png" alt="EcoAmazónico" className="h-7 w-auto object-contain brightness-0 invert" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="h-5 w-px bg-white/20" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-medium">
                  Panel interno
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={LANDING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gray-300 hover:text-eco-lime transition font-medium"
            >
              Ver landing
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-eco-lime" />
              <span>{auth.user.email}</span>
            </div>

            <button
              type="button"
              onClick={() => logout().then(() => window.location.replace('/login'))}
              className="text-xs uppercase tracking-[0.15em] text-white border border-white/20 hover:border-eco-lime hover:text-eco-lime transition px-3 py-1.5 cursor-pointer font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`${mobileNavOpen ? 'block' : 'hidden'} md:block fixed md:sticky top-14 left-0 right-0 md:right-auto z-30 md:w-72 md:flex-shrink-0 bg-white border-r border-gray-200 md:h-[calc(100vh-3.5rem)] overflow-y-auto`}
        >
          <nav className="p-4 md:p-6 space-y-6">
            {(['inicio', 'servicios', 'global'] as const).map((group) => (
              <div key={group}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3 px-2">
                  {GROUP_LABELS[group]}
                </p>
                <ul className="space-y-0.5">
                  {grouped[group].map((section) => {
                    const isActive = section.slug === current;
                    return (
                      <li key={section.slug}>
                        <a
                          href={`/editar/${section.slug}`}
                          className={`group flex items-center gap-3 px-2 py-2 text-sm relative transition ${
                            isActive
                              ? 'text-black font-medium'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-eco-lime" />
                          )}
                          <SectionIcon name={section.icon} className={`h-4 w-4 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-black'} transition`} />
                          <span className="flex-1 truncate">{section.label}</span>
                          {isActive && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
            {(eyebrow || title) && (
              <div className="mb-8 md:mb-12">
                {eyebrow && (
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-3">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {title}
                  </h1>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
