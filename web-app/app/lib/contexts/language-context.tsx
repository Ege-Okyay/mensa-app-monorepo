import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../locales";
import type { TranslationKeys } from "../locales/en";

export type Language = "it" | "en" | "tr";

// Autocompletion stuff
type LeaveKeys<T> = T extends object ? { [K in keyof T]: `${K & string}${T[K] extends object ? "." : ""}${LeaveKeys<T[K]>}` }[keyof T] : "";
export type AllPaths = LeaveKeys<TranslationKeys>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: AllPaths) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("it");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    localStorage.setItem("lang", lang);
  };

  const t = (path: string): string => {
    const keys = path.split(".");

    let result: any = translations[language];

    for (const key of keys) {
      if (result?.[key] === undefined) return path;

      result = result[key];
    }

    return typeof result === "string" ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");

  return context;
};
