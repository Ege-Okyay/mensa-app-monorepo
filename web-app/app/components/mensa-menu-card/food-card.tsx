import { Info, X, Leaf, Carrot } from "lucide-react";
import AllergyCard from "./allergy-card";
import type { MenuItem } from "~/lib/api/types";
import { useTranslation, type AllPaths } from "~/lib/contexts/language-context";

interface FoodCardProps {
  menuItem: MenuItem;
}

const dietaryConfig = {
  Vegan: {
    icon: Leaf,
    styles: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  },
  Vegetarian: {
    icon: Carrot,
    styles: "bg-amber-50 text-amber-600 border-amber-100/50",
  },
  Meat: { label: "", icon: null, styles: "hidden" }
};

export default function FoodCard({ menuItem }: FoodCardProps) {
  const { t, language } = useTranslation();

  return (
    <div className="collapse rounded-xl border-border border bg-background transition-all duration-300 ease-in-out has-checked:bg-brand-soft has-checked:border-brand-border group w-full">
      <input type="checkbox" className="peer" />
      <div className="collapse-title p-3 min-h-0 flex flex-col gap-1">
        <div className="flex flex-row justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-text text-h2 font-bold leading-tight">{menuItem[language].name}</h2>
            
            {menuItem.dietary_category && menuItem.dietary_category !== "Meat" && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-sm ${dietaryConfig[menuItem.dietary_category].styles}`}>
                {(() => {
                  const Icon = dietaryConfig[menuItem.dietary_category].icon;
                  return Icon ? <Icon className="w-2.5 h-2.5" /> : null;
                })()}
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {t(`dietary.${menuItem.dietary_category.toLowerCase()}` as AllPaths)}
                </span>
              </div>
            )}
          </div>

          <div className="p-1 shrink-0">
            <Info className="group-has-checked:hidden block text-brand w-4 h-4" />
            <X className="group-has-checked:block hidden text-brand w-4 h-4" />
          </div>
        </div>
        <span className="text-body text-text-muted leading-tight">{menuItem[language].description}</span>
      </div>
      <div className="collapse-content transition-all ease-in-out duration-300">
        <AllergyCard allergens={menuItem.allergens} />
      </div>
    </div>
  );
}
