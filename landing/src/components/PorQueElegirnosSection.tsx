import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { PorQueElegirnosContent } from '../lib/types';
import TypewriterText from './TypewriterText';
import ElegantCarousel from './ElegantCarousel';

interface Props {
  fallback: PorQueElegirnosContent;
}

const ICON_PATHS: Record<string, string> = {
  document:
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  users:
    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  briefcase:
    'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  star: 'M12 3l2.7 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17l-5.5 2.9 1.1-6.1L3.1 9.5l6.2-.9L12 3z',
  shield:
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  leaf: 'M5 21V7a8 8 0 018-8M5 21l7-7m-7 7v-7a4 4 0 014-4h0',
};

function ItemIcon({ name }: { name: string }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.document;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

export default function PorQueElegirnosSection({ fallback }: Props) {
  const data = useFirestoreDoc<PorQueElegirnosContent>('siteContent', 'porQueElegirnos', fallback);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Carousel */}
      <div className="relative h-[650px] rounded-3xl overflow-hidden shadow-2xl group order-2 lg:order-1">
        <ElegantCarousel images={data.carouselImages} />
      </div>

      {/* Right: Text */}
      <div className="order-1 lg:order-2">
        <div className="space-y-6">
          <div>
            <span className="bg-eco-lime text-green-950 px-3 py-1 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide inline-block mb-2">
              {data.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {data.titlePrefix}{' '}
              <TypewriterText words={data.typewriterWords} className="text-eco-lime" />
            </h2>
          </div>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed text-justify whitespace-pre-line">
            {data.paragraph}
          </p>

          <div className="space-y-6 pt-4">
            {data.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-eco-lime/10 flex items-center justify-center text-eco-lime">
                    <ItemIcon name={item.icon} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed text-justify whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
