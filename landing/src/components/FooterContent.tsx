import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { FooterContent as FooterContentType } from '../lib/types';

interface Props {
  fallback: FooterContentType;
  logoSrc: string;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 10 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.34105 7.78582L9.11687 9.58099C9.07895 9.88086 8.82429 10.1064 8.52222 10.1064H5.60653V17.612C5.29904 17.6397 4.98749 17.6538 4.67256 17.6538C3.96819 17.6538 3.28075 17.5836 2.61633 17.4499V10.1064H0.373859C0.167966 10.1064 0 9.93827 0 9.73227V7.48595C0 7.27996 0.167966 7.11179 0.373859 7.11179H2.61633V3.74297C2.61633 1.67563 4.2899 0 6.35492 0H8.97126C9.17715 0 9.34512 0.16817 9.34512 0.374162V2.62049C9.34512 2.82648 9.17715 2.99465 8.97126 2.99465H7.10196C6.27636 2.99465 5.60721 3.66463 5.60721 4.49197V7.11246H8.74708C9.10739 7.11246 9.38575 7.42854 9.34173 7.78649L9.34105 7.78582Z" />
    </svg>
  ),
  tiktok: (
    <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6524 12.7841V5.17503C10.6524 5.17503 11.5355 6.60502 14.7277 6.69237C14.8979 6.69701 15.0387 6.56096 15.0387 6.39555V4.24515C15.0387 4.08514 14.9075 3.95838 14.7428 3.9491C12.2667 3.81306 11.0908 1.96798 10.9754 0.27595C10.9651 0.119037 10.8234 0 10.6619 0H8.13733C7.96945 0 7.8326 0.132178 7.8326 0.296047V12.3922C7.8326 13.7063 6.79906 14.8495 5.44806 14.9114C3.90371 14.9825 2.64819 13.6947 2.83914 12.1727C2.9744 11.0975 3.86234 10.2171 4.96669 10.0679C5.18629 10.0386 5.40032 10.0362 5.60798 10.0587C5.79178 10.0787 5.95329 9.9458 5.95329 9.76647V7.61066C5.95329 7.45761 5.83315 7.32466 5.67561 7.31538C5.35895 7.29528 5.03432 7.30224 4.70493 7.33857C2.26946 7.60756 0.303425 9.52221 0.0337022 11.889C-0.321951 15.0111 2.18433 17.6538 5.32632 17.6538C8.26782 17.6538 10.6524 15.3373 10.6524 12.4796" />
    </svg>
  ),
  instagram: (
    <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3926 0H4.26121C1.90827 0 0 1.90827 0 4.26121V13.3926C0 15.7456 1.90827 17.6538 4.26121 17.6538H13.3926C15.7456 17.6538 17.6538 15.7456 17.6538 13.3926V4.26121C17.6538 1.90827 15.7456 0 13.3926 0ZM16.1318 13.0877C16.1318 14.7681 14.7681 16.1318 13.0877 16.1318H4.56528C2.88485 16.1318 1.5212 14.7681 1.5212 13.0877V4.56528C1.5212 2.88485 2.88485 1.5212 4.56528 1.5212H13.0877C14.7681 1.5212 16.1318 2.88485 16.1318 4.56528V13.0877Z" />
      <path d="M8.83553 4.26134C6.31573 4.26134 4.27025 6.30683 4.27025 8.82663C4.27025 11.3464 6.31573 13.3919 8.83553 13.3919C11.3553 13.3919 13.4008 11.3464 13.4008 8.82663C13.4008 6.30683 11.3553 4.26134 8.83553 4.26134ZM8.83553 11.8707C7.15849 11.8707 5.79145 10.5037 5.79145 8.82663C5.79145 7.14958 7.15849 5.78254 8.83553 5.78254C10.5126 5.78254 11.8796 7.14958 11.8796 8.82663C11.8796 10.5037 10.5126 11.8707 8.83553 11.8707Z" />
      <path d="M13.7055 4.86998C14.2097 4.86998 14.6185 4.46119 14.6185 3.95692C14.6185 3.45266 14.2097 3.04387 13.7055 3.04387C13.2012 3.04387 12.7924 3.45266 12.7924 3.95692C12.7924 4.46119 13.2012 4.86998 13.7055 4.86998Z" />
    </svg>
  ),
  linkedin: (
    <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.76c1.4-2.58 7-2.77 7 2.47V19z" />
    </svg>
  ),
  youtube: (
    <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

const PinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-eco-lime shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function FooterContent({ fallback, logoSrc }: Props) {
  const data = useFirestoreDoc<FooterContentType>('siteContent', 'footer', fallback);

  const primaryOffices = data.offices.filter((o) => o.primary);
  const secondaryOffices = data.offices.filter((o) => !o.primary);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Column 1: Brand + Contact + Social */}
        <div className="space-y-4 text-center md:text-left">
          <a href="/" className="inline-block">
            <img src={logoSrc} alt="Logo EcoAmazónico" className="h-16 w-auto object-contain hover:opacity-100 transition-opacity" />
          </a>

          <div className="space-y-6">
            {data.phone && (
              <div>
                <p className="text-sm text-white-500 font-semibold tracking-wider mb-2">Teléfono</p>
                <div className="flex items-center gap-3 justify-center md:justify-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-eco-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-sm font-medium">{data.phone}</span>
                </div>
              </div>
            )}

            {data.email && (
              <div>
                <p className="text-sm text-white-500 font-semibold tracking-wider mb-2">Correo</p>
                <div className="flex flex-col w-fit mx-auto md:mx-0">
                  <div className="flex items-center gap-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-eco-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-medium break-all">{data.email}</span>
                  </div>
                </div>
              </div>
            )}

            {data.social.length > 0 && (
              <div>
                <p className="text-sm text-white-500 font-semibold tracking-wider mb-3 mt-2">Nuestro Contacto</p>
                <div className="flex items-center justify-center md:justify-start gap-10">
                  {data.social.map((s, i) => (
                    <a
                      key={i}
                      href={s.url || '#'}
                      target={s.url && s.url !== '#' ? '_blank' : undefined}
                      rel={s.url && s.url !== '#' ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-eco-lime transition-colors"
                      aria-label={s.platform}
                    >
                      {SOCIAL_ICONS[s.platform.toLowerCase()] ?? (
                        <span className="text-xs uppercase">{s.platform}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columns 2 & 3: Offices */}
        <div className="md:col-span-2 space-y-8">
          {primaryOffices.map((office, i) => (
            <OfficeBlock key={`p-${i}`} office={office} large />
          ))}

          {secondaryOffices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {secondaryOffices.map((office, i) => (
                <OfficeBlock key={`s-${i}`} office={office} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-600 text-sm mt-4">
        <p>&copy; {new Date().getFullYear()} EcoAmazónico. Todos los derechos reservados.</p>
      </div>
    </>
  );
}

function OfficeBlock({
  office,
  large,
}: {
  office: FooterContentType['offices'][number];
  large?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
        <PinIcon />
        <h3 className="text-white font-bold text-lg">{office.name}</h3>
      </div>
      <div className={`rounded-xl overflow-hidden bg-gray-800 relative border border-gray-700 shadow-lg ${large ? 'h-64' : 'h-40'}`}>
        {office.mapEmbedUrl && (
          <iframe
            src={office.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
            title={office.name}
          />
        )}
      </div>
      <p className="text-gray-400 text-sm text-center md:text-left">{office.address}</p>
    </div>
  );
}
