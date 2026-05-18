import React, { useState, useEffect } from 'react';
import { checkProfanity, type Language } from 'glin-profanity';

interface WhatsAppButtonProps {
  iconSrc: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ iconSrc }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpenChat = (event: CustomEvent<{ message: string }>) => {
      // Ensure button is visible (even if not scrolled down enough, we force it)
      setIsVisible(true);
      setIsOpen(true);
      if (event.detail && event.detail.message) {
        setFormData(prev => ({ ...prev, message: event.detail.message }));
      }
    };

    window.addEventListener('open-whatsapp-chat', handleOpenChat as EventListener);
    
    return () => {
      window.removeEventListener('open-whatsapp-chat', handleOpenChat as EventListener);
    };
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling past the hero section (approx 800px or window height)
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // Close form when button hides
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validación de longitud
    if (formData.message.length > 500) {
      setError('El mensaje es demasiado largo');
      return;
    }

    // Filtro de palabras ofensivas usando glin-profanity
    const profanityConfig = {
      languages: ['spanish', 'english'] as Language[],
      detectLeetspeak: true,
      customWords: ['estafa', 'robo', 'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil', 'mierda', 'puta', 'malparido', 'carajo', 'cojudo', 'pendejo', 'cabron', 'cabrón', 'verga', 'concha', 'mamaguevo']
    };

    const messageCheck = checkProfanity(formData.message, profanityConfig);
    const nameCheck = checkProfanity(formData.name, profanityConfig);

    if (messageCheck.containsProfanity || nameCheck.containsProfanity) {
      setError('El mensaje contiene palabras no permitidas');
      return;
    }

    // Construct WhatsApp message
    const phoneNumber = "51945775810";
    const text = `Hola Ecoamazónico, mi nombre es *${formData.name}*.%0A%0AMe gustaría consultar lo siguiente:%0A${formData.message}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form and close
    setFormData({ name: '', message: '' });
    setIsOpen(false);
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-[90] transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      {/* Container for future expandable content */}
      <div className={`absolute bottom-full right-0 mb-4 transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">¡Escríbenos!</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <div className="text-red-500 text-xs mb-2 text-center font-medium bg-red-50 p-2 rounded">{error}</div>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4EA10] focus:border-transparent text-sm"
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4EA10] focus:border-transparent text-sm resize-none"
                placeholder="¿En qué podemos ayudarte?"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="mt-2 bg-[#C4EA10] hover:bg-[#a3c20d] text-green-950 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <span>Consultar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="relative group p-0 rounded-full drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center w-12 h-12 md:w-14 md:h-14 focus:outline-none"
        aria-label="Contactar por WhatsApp"
      >
        <img 
          src={iconSrc} 
          alt="WhatsApp" 
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
};

export default WhatsAppButton;
