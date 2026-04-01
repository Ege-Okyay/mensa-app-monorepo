import { CheckCircle2 } from "lucide-react";
import Allergy from "./allergy";

interface AllergyCardProps {
  allergens: string[];
}

export default function AllergyCard({ allergens }: AllergyCardProps) {
  const hasAllergens = allergens && allergens.length > 0;

  return (
    <div className="bg-white rounded-lg border border-brand-border-subtle p-3 flex flex-col gap-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <span className="text-brand font-bold text-body-sm uppercase tracking-[0.15em]">Allergens</span>
        
        {hasAllergens ? (
          <div className="flex flex-row gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {allergens.map((allergen) => (
              <Allergy key={allergen} name={allergen} />
            ))}
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2 py-0.5 px-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[11px] font-medium text-text-muted italic">No common allergens identified</span>
          </div>
        )}
      </div>

      <div className="border-t border-brand-border-subtle pt-2 hidden group-has-checked:block animate-in fade-in slide-in-from-top-1 duration-500">
        <div className="flex items-center gap-2 opacity-40">
          <div className="h-1.5 w-1.5 rounded-full bg-brand"></div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">More details coming soon</span>
        </div>
      </div>
    </div>
  );
}
