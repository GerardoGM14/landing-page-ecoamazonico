import { SECTIONS, GROUP_LABELS, type Section } from '../lib/sections';
import SectionIcon from './SectionIcon';

export default function DashboardHome() {
  const grouped = SECTIONS.reduce<Record<Section['group'], Section[]>>(
    (acc, s) => {
      (acc[s.group] ??= []).push(s);
      return acc;
    },
    { inicio: [], servicios: [], global: [] }
  );

  return (
    <div className="space-y-12">
      {(['inicio', 'servicios', 'global'] as const).map((group) => (
        <section key={group}>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
              {GROUP_LABELS[group]}
            </h2>
            <span className="text-xs text-gray-400">
              {grouped[group].length} {grouped[group].length === 1 ? 'sección' : 'secciones'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            {grouped[group].map((section) => (
              <a
                key={section.slug}
                href={`/editar/${section.slug}`}
                className="group relative bg-white p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col gap-4 min-h-[180px]"
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-full bg-black text-white grid place-items-center group-hover:bg-eco-lime group-hover:text-black transition">
                    <SectionIcon name={section.icon} className="h-5 w-5" />
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black mb-1.5 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {section.label}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-eco-lime group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
