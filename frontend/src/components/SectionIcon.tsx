import type { Section } from '../lib/sections';

interface Props {
  name: Section['icon'];
  className?: string;
}

export default function SectionIcon({ name, className = 'h-5 w-5' }: Props) {
  const common = { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.6, className };
  switch (name) {
    case 'hero':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 14l5-4 4 3 4-5 5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'about':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 3l2.7 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17l-5.5 2.9 1.1-6.1L3.1 9.5l6.2-.9L12 3z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common}>
          <path d="M9 3l-6 2v16l6-2 6 2 6-2V3l-6 2-6-2z" strokeLinejoin="round" />
          <path d="M9 3v16M15 5v16" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...common}>
          <path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.32 1.9.57 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.25 1.85.44 2.81.57A2 2 0 0122 16.92z" strokeLinejoin="round" />
        </svg>
      );
    case 'video':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="14" height="14" rx="2" />
          <path d="M17 9l4-2v10l-4-2z" strokeLinejoin="round" />
        </svg>
      );
  }
}
