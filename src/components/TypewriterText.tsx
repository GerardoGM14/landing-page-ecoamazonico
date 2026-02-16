import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 75,
  pauseDuration = 2000,
  className = "",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = words[currentWordIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      // Logic for speed changes and state transitions would be handled by the timeout duration in the next render cycle
      // But here we are inside the callback.
    };

    let timer: ReturnType<typeof setTimeout>;
    const fullText = words[currentWordIndex];

    if (!isDeleting && currentText === fullText) {
      // Finished typing, pause before deleting
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Continue typing or deleting
      timer = setTimeout(() => {
        if (isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        } else {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`${className} inline-flex items-center`}>
      {currentText}
      <span className="animate-pulse ml-0.5">|</span>
    </span>
  );
};

export default TypewriterText;
