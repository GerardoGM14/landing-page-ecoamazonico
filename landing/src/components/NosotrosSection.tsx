import { useFirestoreDoc } from '../lib/useFirestoreDoc';
import type { NosotrosContent } from '../lib/types';
import TypewriterText from './TypewriterText';

interface Props {
  fallback: NosotrosContent;
}

const PinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export default function NosotrosSection({ fallback }: Props) {
  const data = useFirestoreDoc<NosotrosContent>('siteContent', 'nosotros', fallback);
  const [img1, img2, img3] = data.images;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left Column: Text */}
      <div className="space-y-4 lg:pr-16">
        <div>
          <span className="bg-eco-lime text-green-950 px-3 py-1 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide inline-block mb-2">
            {data.badge}
          </span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight flex flex-wrap items-center gap-2">
            {data.titlePrefix}{' '}
            <TypewriterText
              words={data.typewriterWords}
              className="bg-eco-lime text-white px-2 py-1 rounded-sm"
            />
          </h2>
        </div>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify whitespace-pre-line">
          {data.paragraph}
        </p>

        <div className="space-y-3 pt-6">
          {[data.mision, data.vision].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-eco-lime/10 flex items-center justify-center text-green-950 border border-eco-lime/20">
                  <PinIcon />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-base md:text-base leading-relaxed text-justify whitespace-pre-line">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Image Grid */}
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="col-span-2 h-64 md:h-80 rounded-3xl overflow-hidden relative group">
          {img1 && (
            <img
              src={img1}
              alt=""
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="h-40 md:h-56 rounded-3xl overflow-hidden relative group">
          {img2 && (
            <img
              src={img2}
              alt=""
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          )}
        </div>
        <div className="h-40 md:h-56 rounded-3xl overflow-hidden relative group">
          {img3 && (
            <img
              src={img3}
              alt=""
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          )}
        </div>
      </div>
    </div>
  );
}
