import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "~/lib/contexts/language-context";
import type { LegalPage } from "~/lib/legal-content";

export default function LegalPageView({ page }: { page: LegalPage }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/"
        viewTransition
        className="flex items-center gap-1.5 text-text-muted active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-body-sm font-bold uppercase tracking-widest">
          {t("common.back_to_locations")}
        </span>
      </Link>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-h1 font-black text-text tracking-tight">{page.title}</h1>
        <span className="text-body-sm text-text-muted">{page.updated}</span>
      </div>

      <p className="text-body text-text-muted">{page.intro}</p>

      <div className="flex flex-col gap-6">
        {page.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-h2 font-bold text-text tracking-tight">{section.heading}</h2>
            {section.paragraphs?.map((paragraph, i) => (
              <p key={i} className="text-body text-text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="flex flex-col gap-1.5 list-disc pl-5">
                {section.items.map((item, i) => (
                  <li key={i} className="text-body text-text-muted leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
