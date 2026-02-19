import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  speed?: number; // Alias for typingSpeed
  cursorClassName?: string;
  loop?: boolean; // New prop to control looping
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 75,
  pauseDuration = 2000,
  className = "",
  speed,
  cursorClassName = "",
  loop = true, // Default to true for backward compatibility
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // Track if typing is finished (for non-looping)

  // Use speed prop if provided, otherwise default to typingSpeed
  const actualTypingSpeed = speed || typingSpeed;

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isFinished) return; // Stop if finished

    const handleTyping = () => {
      const fullText = words[currentWordIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const fullText = words[currentWordIndex];

    if (!isDeleting && currentText === fullText) {
      // Finished typing current word
      if (!loop && currentWordIndex === words.length - 1) {
          setIsFinished(true); // Mark as finished if it's the last word and loop is false
      } else {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
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
      }, isDeleting ? deletingSpeed : actualTypingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, actualTypingSpeed, deletingSpeed, pauseDuration, loop, isFinished]);

  return (
    <span className={`${className} inline-flex items-center`}>
      {currentText}
      <span className={`ml-0.5 ${cursorVisible && !isFinished ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ${cursorClassName}`}>|</span>
    </span>
  );
};

export default TypewriterText;
