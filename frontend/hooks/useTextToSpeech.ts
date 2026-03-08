import { useState, useEffect, useCallback } from 'react';
import { Language, LANGUAGE_CODES } from '@/lib/types';

export function useTextToSpeech(language: Language = 'english') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      setIsSupported(false);
      console.warn('Speech synthesis not supported in this browser');
    }

    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, selectedLanguage?: Language) => {
    if (!window.speechSynthesis || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Remove markdown formatting for better speech
    const cleanText = text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove code blocks
      .replace(/---/g, '') // Remove horizontal rules
      .replace(/>\s/g, '') // Remove blockquotes
      .replace(/\n{3,}/g, '\n\n'); // Reduce multiple newlines

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language based on selected language
    const lang = selectedLanguage || language;
    utterance.lang = LANGUAGE_CODES[lang] || 'en-IN';
    
    // Set voice properties
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => 
      voice.lang.startsWith(utterance.lang.split('-')[0])
    );
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
  };
}
