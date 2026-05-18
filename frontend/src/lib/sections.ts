export interface Section {
  slug: string;
  label: string;
  description: string;
  group: 'inicio' | 'servicios' | 'global';
  icon: 'hero' | 'about' | 'star' | 'grid' | 'map' | 'badge' | 'phone' | 'video';
}

export const SECTIONS: Section[] = [
  {
    slug: 'hero',
    label: 'Hero',
    description: 'Título principal, párrafo, botones y videos de fondo.',
    group: 'inicio',
    icon: 'hero',
  },
  {
    slug: 'nosotros',
    label: 'Sobre Nosotros',
    description: 'Badge, título, misión, visión e imágenes.',
    group: 'inicio',
    icon: 'about',
  },
  {
    slug: 'por-que-elegirnos',
    label: '¿Por qué elegirnos?',
    description: 'Sección oscura con carrusel y los 3 ítems destacados.',
    group: 'inicio',
    icon: 'star',
  },
  {
    slug: 'servicios',
    label: 'Servicios (cards)',
    description: 'Las 5 tarjetas de servicios: títulos, descripciones e imágenes.',
    group: 'servicios',
    icon: 'grid',
  },
  {
    slug: 'experiencia',
    label: 'Experiencia',
    description: 'Texto introductorio y las 3 métricas (años, cobertura, proyectos).',
    group: 'inicio',
    icon: 'map',
  },
  {
    slug: 'certificaciones',
    label: 'Certificaciones',
    description: 'SENACE, INIA y la imagen de fondo.',
    group: 'inicio',
    icon: 'badge',
  },
  {
    slug: 'footer',
    label: 'Contacto y oficinas',
    description: 'Teléfono, correo, redes sociales y las 3 oficinas.',
    group: 'global',
    icon: 'phone',
  },
  {
    slug: 'pagina-servicios',
    label: 'Página /servicios',
    description: 'Hero, subtítulo y video de la página interna de servicios.',
    group: 'servicios',
    icon: 'video',
  },
];

export const GROUP_LABELS: Record<Section['group'], string> = {
  inicio: 'Página de inicio',
  servicios: 'Servicios',
  global: 'Global',
};
