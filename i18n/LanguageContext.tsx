'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema } from './types';
import { vi } from './locales/vi';
import { en } from './locales/en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Language, TranslationSchema> = { vi, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('flashcart_language') as Language;
    if (saved === 'vi' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flashcart_language', lang);
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const dict = dictionaries[language] || dictionaries.vi;
    const fallbackDict = dictionaries.en;

    const keys = path.split('.');
    let current: any = dict;
    let fallbackCurrent: any = fallbackDict;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
      }

      if (fallbackCurrent && typeof fallbackCurrent === 'object' && key in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[key];
      } else {
        fallbackCurrent = undefined;
      }
    }

    let result = typeof current === 'string' ? current : typeof fallbackCurrent === 'string' ? fallbackCurrent : path;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
