"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { hi } from "@/locales/hi";
import { en } from "@/locales/en";

export type Language = "hi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dict: typeof hi;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "hi",
  setLanguage: () => {},
  toggleLanguage: () => {},
  dict: hi,
  isHindi: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("hi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bm_lang");
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        localStorage.setItem("bm_lang", "hi");
        document.documentElement.lang = "hi";
      }
    } catch {
      document.documentElement.lang = "hi";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("bm_lang", lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "hi" ? "en" : "hi";
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
