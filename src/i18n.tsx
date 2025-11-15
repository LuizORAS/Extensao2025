import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './LanguageContext';
import type { Locale } from './types/languages';

type Bundle = Record<string, any>;

const CACHE: Record<string, Bundle> = {};
const DEFAULT_FALLBACKS: Locale[] = ['pt-BR', 'en-US'];

async function loadBundle(lang: string): Promise<Bundle | null> {
  if (!lang) return null;
  if (CACHE[lang]) return CACHE[lang];

  // Try exact match
  try {
    const mod = await import(`./locales/${lang}.json`);
    const bundle = (mod && (mod.default ?? mod)) as Bundle;
    CACHE[lang] = bundle;
    return bundle;
  } catch (e) {
    // continue to try base language
  }

  // Try base language (e.g., 'pt' from 'pt-BR')
  const base = lang.split('-')[0];
  if (base && base !== lang) {
    // try common variants: base, base uppercase region variants
    const candidates = [base, `${base}-${base.toUpperCase()}`];
    for (const c of candidates) {
      try {
        const mod = await import(`./locales/${c}.json`);
        const bundle = (mod && (mod.default ?? mod)) as Bundle;
        CACHE[lang] = bundle; // cache under requested lang for convenience
        CACHE[c] = bundle;
        return bundle;
      } catch (e) {
        // ignore
      }
    }
  }

  return null;
}

function lookup(bundle: Bundle | null, key: string): string | undefined {
  if (!bundle) return undefined;
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
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setReady(false);

    (async () => {
      // try requested language then fallbacks
      const tries: string[] = [language as string, ...DEFAULT_FALLBACKS];
      for (const l of tries) {
        if (!l) continue;
        const b = await loadBundle(l);
        if (b) {
          if (!mounted) return;
          setBundle(b);
          setReady(true);
          return;
        }
      }
      // nothing found
      if (mounted) {
        setBundle({});
        setReady(true);
      }
    })();

    return () => { mounted = false; };
  }, [language]);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const v = lookup(bundle, key);
      if (v == null) return key;
      if (!vars) return v;
      return v.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
    };
  }, [bundle]);

  return { t, language: language as Locale, ready } as const;
}

export default useTranslation;
