import HeroVideo from './HeroVideo';
import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { HeroContent } from '../lib/types';

interface Props {
  fallback: HeroContent;
  maxDuration?: number;
}

export default function HeroVideoLive({ fallback, maxDuration = 15 }: Props) {
  const hero = useFirestoreDoc<HeroContent>('siteContent', 'hero', fallback);
  return <HeroVideo poster={hero.posterUrl} videos={hero.videos} maxDuration={maxDuration} />;
}
