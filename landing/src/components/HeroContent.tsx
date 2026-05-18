import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { HeroContent as HeroContentType } from '../lib/types';

interface Props {
  fallback: HeroContentType;
}

export default function HeroContent({ fallback }: Props) {
  const hero = useFirestoreDoc<HeroContentType>('siteContent', 'hero', fallback);

  return (
    <div className="text-left">
      <h1 className="text-4xl md:text-4xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
        {hero.title}
      </h1>
      <p className="text-base md:text-lg mb-8 md:mb-10 text-gray-200 max-w-xl drop-shadow-md whitespace-pre-line">
        {hero.paragraph}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={hero.ctaPrimary.href}
          className="bg-eco-lime text-green-950 px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-green-900 transition duration-300 flex items-center justify-center gap-2"
        >
          <span>{hero.ctaPrimary.label}</span>
        </a>
        <a
          href={hero.ctaSecondary.href}
          className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-green-950 transition duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <span>{hero.ctaSecondary.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </a>
      </div>
    </div>
  );
}
