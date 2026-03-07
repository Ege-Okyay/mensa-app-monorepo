import { ChevronDown, Globe } from "lucide-react";
import { useState, useRef } from "react";

const languages = [
  { code: "EN", name: "English" },
  { code: "IT", name: "Italiano" },
  { code: "TR", name: "Türkçe" },
];

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    setSelectedLanguage(language);
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="dropdown dropdown-end group">
      <summary
        className="btn flex list-none flex-row items-center justify-between gap-2 rounded-full border-2 border-border bg-white px-4 py-2 font-bold text-text"
      >
        <Globe className="h-4 w-4 text-brand" />
        {selectedLanguage.code}
        <ChevronDown
          className="h-4 w-4 text-text transition-transform group-open:rotate-180"
        />
      </summary>
      <ul
        className="menu dropdown-content z-1 mt-1 w-28 rounded-box bg-white p-2 shadow"
      >
        {languages.map((lang) => (
          <li key={lang.code} onClick={() => handleLanguageSelect(lang)}>
            <a>{lang.name}</a>
          </li>
        ))}
      </ul>
    </details>
  );
}
