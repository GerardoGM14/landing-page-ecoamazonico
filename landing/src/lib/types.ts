export interface HeroContent {
  title: string;
  paragraph: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  videos: string[];
  posterUrl: string;
}

export interface NosotrosContent {
  badge: string;
  titlePrefix: string;
  typewriterWords: string[];
  paragraph: string;
  mision: { title: string; text: string };
  vision: { title: string; text: string };
  images: string[];
}

export interface PorQueElegirnosContent {
  badge: string;
  titlePrefix: string;
  typewriterWords: string[];
  paragraph: string;
  carouselImages: string[];
  items: Array<{ title: string; description: string; icon: string }>;
}

export interface ExperienciaContent {
  badge: string;
  titlePrefix: string;
  typewriterWords: string[];
  paragraphFull: string;
  stats: Array<{ value: string; label: string; icon: string }>;
}

export interface CertificacionesContent {
  badge: string;
  title: string;
  items: Array<{ name: string; logoUrl: string; description: string }>;
  backgroundUrl: string;
}

export interface FooterContent {
  phone: string;
  email: string;
  social: Array<{ platform: string; url: string }>;
  offices: Array<{ name: string; address: string; mapEmbedUrl: string; primary: boolean }>;
}

export interface ServicesPageHeroContent {
  title: string;
  subtitle: string;
  videoUrl: string;
}

export interface Service {
  id: string;
  order: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  imageUrl: string;
  detailImages: string[];
}
