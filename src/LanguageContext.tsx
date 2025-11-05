import React, { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (l: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try { return localStorage.getItem('app_language') || 'pt-BR'; } catch (e) { return 'pt-BR'; }
  });

  // persist and notify on language changes
  useEffect(() => {
    try { localStorage.setItem('app_language', language); } catch (e) { /* ignore */ }
    try {
      // set document lang attributes so screen readers and other consumers can pick it up
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('language:changed', { detail: { language } }));
    } catch (e) { /* ignore */ }
  }, [language]);

  const setLanguage = (l: string) => setLanguageState(l);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
