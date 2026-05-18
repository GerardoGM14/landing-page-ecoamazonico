import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const BUCKET = 'eco-as.firebasestorage.app';
const img = (name) => `https://storage.googleapis.com/${BUCKET}/site/seed/${name}`;

const siteContent = {
  hero: {
    title: 'Eco Amazónico Peru SRL',
    paragraph:
      'Somos una empresa que lideramos la gestión de proyectos y consultorías que promueve el desarrollo territorial con innovación tecnológica, responsabilidad social y ambiental, equidad de género e inclusión social, hacia un desarrollo sostenible.',
    ctaPrimary: { label: 'Nuestros Servicios', href: '#servicios' },
    ctaSecondary: { label: 'Conócenos', href: '#nosotros' },
    videos: ['/selva-video.mp4', '/sierra-video.mp4', '/costa-video.mp4'],
    posterUrl: img('hero_background_v2.jpg'),
  },

  nosotros: {
    badge: 'Sobre Nosotros',
    titlePrefix: '+ de 10 años comprometidos con la',
    typewriterWords: ['seguridad', 'calidad', 'confianza'],
    paragraph:
      'Gestionamos y ejecutamos proyectos integrales de ingeniería ambiental, desarrollo social, viabilidad económica, infraestructura educativa y otros sectores clave. Nuestra labor está respaldada por la participación de profesionales de amplia experiencia y reconocido prestigio, comprometidos con brindar soluciones de calidad en todas las regiones del país.',
    mision: {
      title: 'Misión',
      text: 'Agregar valor de calidad a empresas, gobiernos locales y regionales y organizaciones sociales, brindando soluciones y capacidades de gerencia, estrategias y gestión de desarrollo económico innovativo y sostenible.',
    },
    vision: {
      title: 'Visión',
      text: 'Ser líderes en la gestión de proyectos de desarrollo sostenible, investigación e innovación tecnológica, con inclusión y gran responsabilidad social y ambiental, en el ámbito regional, nacional e internacional.',
    },
    images: [img('about_1.jpg'), img('about_2.jpg'), img('about_3.jpg')],
  },

  porQueElegirnos: {
    badge: '¿Por qué elegirnos?',
    titlePrefix: 'Soluciones integrales con',
    typewriterWords: [
      'responsabilidad ambiental',
      'innovación sostenible',
      'compromiso social',
      'excelencia técnica',
      'visión de futuro',
    ],
    paragraph:
      'ECO AMAZONICO PERU SRL. cuenta con un equipo multidisciplinario de expertos con especialidad técnica de universidades de prestigio con alto grado académico, con más de 20 años de experiencia en investigación, tecnología e innovación.',
    carouselImages: [
      img('carousel_nosotros_1.jpg'),
      img('carousel_nosotros_2.jpg'),
      img('carousel_nosotros_3.jpg'),
      img('carousel_nosotros_4.jpg'),
    ],
    items: [
      {
        title: 'Estudios Ambientales',
        description:
          'Elaboración de Instrumentos de Gestión Ambiental, evaluación y monitoreo de la calidad de agua, suelo y aire, Planes de Manejo Ambiental, servicios ecosistémicos y otros.',
        icon: 'document',
      },
      {
        title: 'Capacitaciones Especializadas',
        description:
          'Manejo Integrado de Plagas, gestión del suelo, innovación y resiliencia climática de cultivos amazónicos y altoandinos, Buenas Prácticas Agrícolas, formación de facilitadores y promotores, otros.',
        icon: 'users',
      },
      {
        title: 'Proveeduría y Logística',
        description:
          'Suministro de semillas, plantones, fertilizantes e insumos agropecuarios, venta de equipos, herramientas y materiales de construcción, alquiler de equipos de evaluación, monitoreo ambiental y movilidad y otros.',
        icon: 'briefcase',
      },
    ],
  },

  experiencia: {
    badge: 'NUESTRA EXPERIENCIA',
    titlePrefix: 'Experiencia y',
    typewriterWords: ['Cobertura Nacional', 'Calidad Garantizada', 'Profesionalismo'],
    paragraphFull:
      'Eco Amazónico Perú SRL, es una empresa nacional que ha realizado servicios en la gestión de proyectos de desarrollo rural y alternativo, investigación, soluciones tecnológicas resilientes e innovadoras en las temáticas agropecuario, forestal, ambiental, organización de productores, fortalecimiento de capacidades técnicas y organizativas, gestión integral de residuos sólidos, economía circular y otros, en las regiones de Ucayali, San Martin, Huánuco, Junín, Pasco, Lima y otros, trabajando con instituciones del estado, gobiernos regionales y locales, empresas privados y universidades para innovar la competitividad productividad.\nEco Amazónico Perú SRL, es proveedor de semillas, fertilizantes, insumos y otros para la producción agropecuaria; así mismo, alquila equipos de evaluación y monitoreo ambiental, como movilidad de transporte.',
    stats: [
      { value: '+10', label: 'Años de Experiencia', icon: 'calendar' },
      { value: 'Nacional', label: 'Cobertura Total', icon: 'map-pin' },
      { value: '+50', label: 'Proyectos Ejecutados', icon: 'briefcase' },
    ],
  },

  certificaciones: {
    badge: 'CERTIFICADOS QUE NOS RESPALDAN',
    title: 'Contamos con las siguientes certificaciones:',
    items: [
      {
        name: 'SENACE',
        logoUrl: img('icon_senase.png'),
        description:
          'Registro Nacional de Consultores Ambientales en el Servicio Nacional de Certificación Ambiental para las Inversiones Sostenibles (Registro N° 431-2019-AGR). Autorizada para la elaboración de estudios ambientales de los proyectos de inversión.',
      },
      {
        name: 'INIA',
        logoUrl: img('icon_inia.png'),
        description:
          'Certificación del Instituto de Innovación Agraria para la comercialización y producción de semillas, de conformidad a la Ley General de Semillas (Ley No 27262), modificado por el Decreto Ley 1080 y su Reglamento General (Decreto Supremo No 026 -2008-AG).',
      },
    ],
    backgroundUrl: img('fondo_bkg.png'),
  },

  footer: {
    phone: '+51 945 775 810',
    email: 'ecoamazonicoperusrl@gmail.com',
    social: [
      { platform: 'facebook', url: '#' },
      { platform: 'tiktok', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
    offices: [
      {
        name: 'Sede Central - Lima',
        address: 'Av. Insurgentes 594 San Miguel',
        mapEmbedUrl:
          'https://maps.google.com/maps?q=Av.+Insurgentes+594+San+Miguel+Lima&t=&z=15&ie=UTF8&iwloc=&output=embed',
        primary: true,
      },
      {
        name: 'Oficina en Huánuco',
        address: 'Jr. Abancay 201, 2do piso Paucarbamba, Amarilis',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.567087807757!2d-76.2427849241639!3d-9.936353690165977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91a7c2e25c04010b%3A0x62a129377478052a!2sJr.%20Abancay%20201%2C%20Hu%C3%A1nuco%2010001!5e0!3m2!1sen!2spe!4v1709920000000!5m2!1sen!2spe',
        primary: false,
      },
      {
        name: 'Oficina en Junín',
        address: 'Dirección por confirmar',
        mapEmbedUrl: 'https://maps.google.com/maps?q=Junin+Peru&t=&z=9&ie=UTF8&iwloc=&output=embed',
        primary: false,
      },
    ],
  },

  servicesPageHero: {
    title: 'Nuestros Servicios',
    subtitle: 'Soluciones integrales para el desarrollo sostenible',
    videoUrl: '/nuestros-servicios.mp4',
  },
};

const services = [
  {
    id: 'formulacion-proyectos',
    order: 1,
    title: 'Formulación y evaluación de proyectos',
    shortDesc: 'Desarrollo integral de proyectos agrícolas, forestales y de infraestructura.',
    fullDesc:
      'Brindamos servicios especializados en la formulación y evaluación de proyectos en diversos sectores: Agrícolas, Agropecuarios, Forestales, Ambientales, Infraestructuras y otros. Nuestro enfoque garantiza la viabilidad técnica, económica y ambiental de cada iniciativa, asegurando el cumplimiento de normativas vigentes y optimizando el uso de recursos para maximizar el impacto positivo en la comunidad y el entorno.',
    icon: 'clipboard',
    imageUrl: img('servicio_1.jpg'),
    detailImages: [img('servicio_1.jpg'), img('carousel_nosotros_1.jpg')],
  },
  {
    id: 'estudios-investigacion',
    order: 2,
    title: 'Estudios, Investigación y análisis',
    shortDesc: 'Investigación científica y análisis técnico en múltiples disciplinas.',
    fullDesc:
      'Realizamos estudios exhaustivos en áreas agropecuaria, forestal, ambiental, social, educación y salud. Incluye análisis e interpretación de calidad de agua, análisis de macroinvertebrados, bioindicadores y análisis hidrobiológicos. Utilizamos tecnología de punta y metodologías rigurosas para entregar datos precisos que fundamenten la toma de decisiones estratégicas y sostenibles.',
    icon: 'search',
    imageUrl: img('servicio_2.webp'),
    detailImages: [img('servicio_2.webp'), img('carousel_nosotros_3.jpg')],
  },
  {
    id: 'extension-capacitacion',
    order: 3,
    title: 'Extensión y Capacitación',
    shortDesc: 'Transferencia de conocimientos y fortalecimiento de capacidades.',
    fullDesc:
      'Programas de capacitación en sectores agrícolas, pecuarios, forestales, ambientales, salud y educación. Implementamos metodologías como Escuelas de Campo (ECAs) y aprendizaje de campesino a campesino. Nuestros talleres son participativos y adaptados a la realidad local, promoviendo el empoderamiento de las comunidades y la adopción de prácticas innovadoras.',
    icon: 'users',
    imageUrl: img('servicio_3.jpg'),
    detailImages: [img('servicio_3.jpg'), img('about_1.jpg')],
  },
  {
    id: 'proveedores',
    order: 4,
    title: 'Proveedores',
    shortDesc: 'Suministro de bienes e insumos para diversos sectores.',
    fullDesc:
      'Abastecimiento de insumos y bienes agrícolas, forestales, y para sectores de salud, educación y minería. Especialistas en la producción y comercialización de semillas certificadas. Garantizamos la calidad y trazabilidad de todos nuestros productos, estableciendo alianzas estratégicas con proveedores líderes para asegurar el éxito de sus operaciones.',
    icon: 'truck',
    imageUrl: img('servicio_4.jpg'),
    detailImages: [img('servicio_4.jpg'), img('about_3.jpg')],
  },
  {
    id: 'alquileres',
    order: 5,
    title: 'Alquileres',
    shortDesc: 'Renta de vehículos y equipos especializados.',
    fullDesc:
      'Servicio de alquiler de vehículos y equipos de monitoreo ambiental, garantizando herramientas de alta calidad para la ejecución de sus proyectos y operaciones de campo. Contamos con una flota moderna y equipos calibrados, ofreciendo soporte técnico y mantenimiento para asegurar la continuidad y eficiencia de su trabajo en cualquier entorno.',
    icon: 'key',
    imageUrl: img('servicio_5.jpg'),
    detailImages: [img('alquiler_1.jpg'), img('alquiler_2.jpg')],
  },
];

async function seed() {
  console.log('Seeding siteContent/...');
  for (const [docId, data] of Object.entries(siteContent)) {
    await db.collection('siteContent').doc(docId).set(data);
    console.log(`  OK siteContent/${docId}`);
  }

  console.log('\nSeeding services/...');
  for (const { id, ...data } of services) {
    await db.collection('services').doc(id).set(data);
    console.log(`  OK services/${id}`);
  }

  console.log('\nSeed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
