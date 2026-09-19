import { CheckCircle2 } from "lucide-react";
import Allergy from "./allergy";
import { useTranslation } from "~/lib/contexts/language-context";

interface AllergyCardProps {
  allergens: string[];
}

export default function AllergyCard({ allergens }: AllergyCardProps) {
  const hasAllergens = allergens && allergens.length > 0;
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-brand-border-subtle p-3 flex flex-col gap-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <span className="text-brand font-bold text-body-sm uppercase tracking-[0.15em]">{t("allergens.title")}</span>
        
        {hasAllergens ? (
          <div className="flex flex-row gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {allergens.map((allergen) => (
              <Allergy key={allergen} name={allergen} />
            ))}
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2 py-0.5 px-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span className="text-body-sm font-medium text-text-muted italic">{t("allergens.no_common_detected")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
