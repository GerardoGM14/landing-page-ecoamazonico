import React, { useState, useEffect, useRef } from 'react';

interface HeroVideoProps {
  poster: string;
  videos: string[];
  maxDuration?: number;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ poster, videos, maxDuration = 15 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos]);

  // Función para ir al siguiente video
  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  // Efecto principal para manejar reproducción y transiciones
  useEffect(() => {
    if (videos.length === 0) return;

    const currentVideo = videoRefs.current[currentIndex];
    
    // 1. Reproducir el video actual
    if (currentVideo) {
      // Importante: Asegurar que esté muteado para autoplay
      currentVideo.muted = true; 
      
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isLoaded) setIsLoaded(true);
          })
          .catch((error) => {
            console.warn("Autoplay prevented:", error);
            // Intentar recuperar silenciando nuevamente (doble check)
            currentVideo.muted = true;
            currentVideo.play().catch(e => console.error("Retry failed:", e));
          });
      }
    }

    // 2. Pausar los otros videos después de la transición para ahorrar recursos
    const cleanupTimer = setTimeout(() => {
      videoRefs.current.forEach((vid, idx) => {
        if (vid && idx !== currentIndex) {
          vid.pause();
          vid.currentTime = 0; // Resetear para la próxima vez
        }
      });
    }, 1500); // 1.5s (un poco más que la transición CSS de 1s)

    // 3. Configurar el "Watchdog" (Max Duration)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (videos.length > 1) {
        timeoutRef.current = setTimeout(() => {
            nextVideo();
        }, maxDuration * 1000);
    }

    return () => {
      clearTimeout(cleanupTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, videos, maxDuration]); // Dependencias: cada vez que cambia el índice

  // Handler para cuando un video termina naturalmente
  const handleVideoEnded = (index: number) => {
    // Solo hacemos caso si es el video actual (para evitar eventos fantasma)
    if (index === currentIndex && videos.length > 1) {
       if (timeoutRef.current) clearTimeout(timeoutRef.current);
       nextVideo();
    } else if (videos.length === 1) {
        // Loop simple
        const vid = videoRefs.current[0];
        if(vid) {
            vid.currentTime = 0;
            vid.play();
        }
    }
  };

  if (videos.length === 0) {
     return (
        <div className="absolute inset-0 z-0">
          <img src={poster} alt="Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
      );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Poster Base (Fallback) */}
      <img 
        src={poster} 
        alt="Hero Background" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />

      {/* Renderizar TODOS los videos (Estrategia más segura para pocos videos) */}
      {videos.map((src, index) => (
        <video
            key={src} // Usar src como key para reiniciar si cambia la URL
            ref={(el) => {
                // Asignar ref sin retornar valor (void)
                videoRefs.current[index] = el; 
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out`}
            style={{
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 10 : 0,
                pointerEvents: 'none' // Evitar interacción usuario
            }}
            src={src}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleVideoEnded(index)}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default HeroVideo;
