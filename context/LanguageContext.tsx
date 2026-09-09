"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { hi } from "@/locales/hi";
import { en } from "@/locales/en";

export type Language = "hi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dict: typeof en;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  dict: en,
  isHindi: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bm_lang_v2");
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        localStorage.setItem("bm_lang_v2", "en");
        document.documentElement.lang = "en";
      }
    } catch {
      document.documentElement.lang = "en";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("bm_lang_v2", lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
  };

  const dict = language === "hi" ? hi : en;
  const isHindi = language === "hi";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dict,
        isHindi,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
