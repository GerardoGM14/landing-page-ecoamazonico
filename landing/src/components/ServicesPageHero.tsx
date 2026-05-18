import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { ServicesPageHeroContent } from '../lib/types';

interface Props {
  fallback: ServicesPageHeroContent;
}

export default function ServicesPageHero({ fallback }: Props) {
  const data = useFirestoreDoc<ServicesPageHeroContent>('siteContent', 'servicesPageHero', fallback);

  return (
    <div className="relative bg-green-950 py-32 md:py-48 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {data.videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            key={data.videoUrl}
            className="w-full h-full object-cover opacity-40 object-center"
            style={{ objectPosition: 'center 100%' }}
          >
            <source src={data.videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{data.title}</h1>
        <p className="text-xl text-eco-lime/80 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
    </div>
  );
}
