import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectBrowserLanguage = (): Language => {
  // Check if user has manually set a language preference
  const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
    return savedLanguage;
  }

  // Detect browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.toLowerCase().split('-')[0];

  // Map language codes to supported languages
  if (langCode === 'es') return 'es';
  return 'en'; // Default to English
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => detectBrowserLanguage());

  useEffect(() => {
    // Save language preference when it changes
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};