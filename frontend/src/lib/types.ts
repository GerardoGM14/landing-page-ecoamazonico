export interface HeroContent {
  title: string;
  paragraph: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  videos: string[];
  posterUrl: string;
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
