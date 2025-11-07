import { useEffect, useMemo, useState } from 'react';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import { useLanguage } from './LanguageContext';

type Bundle = Record<string, any>;

const BUNDLES: Record<string, Bundle> = {
  'pt-BR': ptBR as any,
  'en-US': enUS as any,
};

// simple deep-get by dot-separated key
function lookup(bundle: Bundle, key: string): string | undefined {
  const parts = key.split('.');
  let cur: any = bundle;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function useTranslation() {
  const { language } = useLanguage();
  const [bundle, setBundle] = useState<Bundle>(() => BUNDLES[language] || BUNDLES['pt-BR']);

  useEffect(() => {
    // static bundles for now; replace with dynamic import() if needed later
    setBundle(BUNDLES[language] || BUNDLES['pt-BR']);
  }, [language]);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const v = lookup(bundle, key);
      if (v == null) return key; // fallback to key to help find missing translations
      if (!vars) return v;
      return v.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
    };
  }, [bundle]);

  return { t, language } as const;
}

export default useTranslation;
