import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { Locale } from './types/languages';

type LanguageContextType = {
  language: Locale;
  setLanguage: (l: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: (() => {}) as (l: Locale) => void,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Locale>(() => {
    try { const v = localStorage.getItem('app_language'); return (v as Locale) || 'pt-BR'; } catch (e) { return 'pt-BR'; }
  });

  // persist and notify on language changes
  useEffect(() => {
    // Avoid unnecessary writes/updates when value is unchanged
    try {
      const current = localStorage.getItem('app_language');
      if (current !== language) {
        localStorage.setItem('app_language', language);
      }
    } catch (e) { /* ignore */ }

    // update document attributes and notify listeners
    try {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    } catch (e) { /* ignore */ }

    try {
      window.dispatchEvent(new CustomEvent('language:changed', { detail: { language } }));
    } catch (e) { /* ignore */ }
  }, [language]);

  // Sync language across tabs/windows
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'app_language' && ev.newValue && ev.newValue !== language) {
        setLanguageState(ev.newValue as Locale);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [language]);

  const setLanguage = useCallback((l: Locale) => {
    if (!l) return;
    setLanguageState(prev => (prev === l ? prev : l));
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
