import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { ExperienciaContent } from '../lib/types';
import TypewriterText from './TypewriterText';

interface Props {
  fallback: ExperienciaContent;
}

const ICON_PATHS: Record<string, React.ReactNode> = {
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  briefcase: (
    <>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
};

function StatIcon({ name }: { name: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name] ?? ICON_PATHS.briefcase}
    </svg>
  );
}

export default function ExperienciaSection({ fallback }: Props) {
  const data = useFirestoreDoc<ExperienciaContent>('siteContent', 'experiencia', fallback);

  return (
    <div className="text-left">
      <span className="bg-eco-lime text-green-950 px-3 py-1 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide inline-block mb-4">
        {data.badge}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
        {data.titlePrefix}{' '}
        <TypewriterText
          words={data.typewriterWords}
          className="bg-eco-lime text-white px-2 py-1 rounded-sm"
          speed={100}
          cursorClassName="text-white"
        />
      </h2>

      <div className="text-base md:text-lg text-gray-700 leading-relaxed">
        <TypewriterText
          words={[data.paragraphFull]}
          className="block min-h-[200px] whitespace-pre-line"
          speed={20}
          cursorClassName="text-eco-lime"
          loop={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
        {data.stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 bg-eco-lime/20 rounded-full flex items-center justify-center mb-4 text-green-800 group-hover:bg-eco-lime group-hover:text-white transition-colors duration-300">
              <StatIcon name={stat.icon} />
            </div>
            <h4 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider whitespace-pre-line">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
