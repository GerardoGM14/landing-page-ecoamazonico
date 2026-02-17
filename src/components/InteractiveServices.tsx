import React, { useState, useEffect } from 'react';

interface Service {
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  images?: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  clipboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  truck: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  key: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
};

interface InteractiveServicesProps {
  services: Service[];
  defaultImage: string;
  images?: string[];
}

const InteractiveServices: React.FC<InteractiveServicesProps> = ({ services, defaultImage, images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getServiceImages = (service: Service) => {
    if (service.images && service.images.length > 0) return service.images;
    if (images && images.length > 0) return images;
    return [defaultImage];
  };

  const activeServiceImages = getServiceImages(services[activeIndex]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % activeServiceImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, activeServiceImages.length]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const index = services.findIndex(s => s.title.toLowerCase().replace(/ /g, '-') === hash);
      if (index !== -1) setActiveIndex(index);
    }
  }, [services]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[500px] lg:min-h-0">
      {/* Navigation - Mobile (Horizontal Scroll) / Desktop (Vertical List) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-2">
        {/* Mobile Navigation */}
        <div className="flex lg:hidden overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 snap-center px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                activeIndex === index
                  ? 'bg-eco-lime text-green-950 border-eco-lime shadow-md transform scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-eco-lime/50'
              }`}
            >
              <span className="flex items-center gap-2">
                {iconMap[service.icon] || iconMap['default']}
                {service.title}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-col gap-3">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left px-5 py-4 rounded-2xl transition-all duration-300 border-l-4 group relative overflow-hidden ${
                activeIndex === index
                  ? 'bg-white border-eco-lime shadow-lg translate-x-2'
                  : 'bg-transparent border-transparent hover:bg-white/50 hover:border-gray-200 hover:translate-x-1'
              }`}
            >
              <div className="flex items-start gap-3 relative z-10">
                <span className={`mt-1 transition-colors duration-300 ${activeIndex === index ? 'text-eco-green' : 'text-gray-400 group-hover:text-eco-green'}`}>
                  {iconMap[service.icon] || iconMap['default']}
                </span>
                <div>
                  <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${
                    activeIndex === index ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {service.title}
                  </h3>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeIndex === index ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-70 group-hover:mt-1'
                  }`}>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full lg:w-2/3 relative h-[420px]">
        {services.map((service, index) => {
          const serviceImages = getServiceImages(service);
          return (
            <div
              key={index}
              className={`transition-all duration-500 absolute inset-0 ${
                activeIndex === index
                  ? 'opacity-100 translate-y-0 z-10 visible'
                  : 'opacity-0 translate-y-4 z-0 invisible pointer-events-none'
              }`}
            >
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 h-full flex flex-col">
                <div className="relative h-56 md:h-64 flex-shrink-0 overflow-hidden group">
                  {serviceImages.map((img, imgIndex) => (
                    <img 
                      key={imgIndex}
                      src={img} 
                      alt={`${service.title} - imagen ${imgIndex + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        imgIndex === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-6 text-white z-10 pr-6">
                    <h3 className="text-2xl md:text-3xl font-bold drop-shadow-lg leading-tight">{service.title}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                  <div className="prose prose-green max-w-none text-gray-600 text-base leading-relaxed">
                    <p>{service.fullDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveServices;
