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

export interface PorQueElegirnosItem {
  title: string;
  description: string;
  icon: string;
}

export interface PorQueElegirnosContent {
  badge: string;
  titlePrefix: string;
  typewriterWords: string[];
  paragraph: string;
  carouselImages: string[];
  items: PorQueElegirnosItem[];
}

export const PQ_ICONS: Array<{ value: string; label: string }> = [
  { value: 'document', label: 'Documento' },
  { value: 'users', label: 'Personas' },
  { value: 'briefcase', label: 'Maletín' },
  { value: 'star', label: 'Estrella' },
  { value: 'shield', label: 'Escudo' },
  { value: 'leaf', label: 'Hoja' },
];

export interface ExperienciaStat {
  value: string;
  label: string;
  icon: string;
}

export interface ExperienciaContent {
  badge: string;
  titlePrefix: string;
  typewriterWords: string[];
  paragraphFull: string;
  stats: ExperienciaStat[];
}

export const STAT_ICONS: Array<{ value: string; label: string }> = [
  { value: 'calendar', label: 'Calendario' },
  { value: 'map-pin', label: 'Pin de mapa' },
  { value: 'briefcase', label: 'Maletín' },
  { value: 'award', label: 'Medalla' },
  { value: 'users', label: 'Personas' },
  { value: 'globe', label: 'Globo' },
];

export interface CertificacionItem {
  name: string;
  logoUrl: string;
  description: string;
}

export interface CertificacionesContent {
  badge: string;
  title: string;
  backgroundUrl: string;
  items: CertificacionItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Office {
  name: string;
  address: string;
  mapEmbedUrl: string;
  primary: boolean;
}

export interface FooterContent {
  phone: string;
  email: string;
  social: SocialLink[];
  offices: Office[];
}

export const SOCIAL_PLATFORMS: Array<{ value: string; label: string }> = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
];

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
  icon: 'clipboard' | 'search' | 'users' | 'truck' | 'key';
  imageUrl: string;
  detailImages: string[];
}

export const SERVICE_ICONS: Array<{ value: Service['icon']; label: string }> = [
  { value: 'clipboard', label: 'Portapapeles' },
  { value: 'search', label: 'Lupa' },
  { value: 'users', label: 'Personas' },
  { value: 'truck', label: 'Camión' },
  { value: 'key', label: 'Llave' },
];
