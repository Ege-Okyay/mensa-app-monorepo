import { Leaf, Carrot, ChevronDown, Search } from "lucide-react";
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
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(menuItem.it.name)}`;

  return (
    <div className="collapse group rounded-xl border-border border bg-background transition-all duration-300 ease-in-out has-checked:bg-brand-soft has-checked:border-brand-border w-full">
      <input type="checkbox" />
      <div className="collapse-title p-3 min-h-0 flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center gap-2">
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

          <ChevronDown className="shrink-0 text-text-muted w-4 h-4 transition-transform duration-300 group-has-checked:rotate-180" />
        </div>
        <span className="text-body text-text-muted leading-tight">{menuItem[language].description}</span>
      </div>
      <div className="collapse-content transition-all ease-in-out duration-300 flex flex-col gap-2">
        <AllergyCard allergens={menuItem.allergens} />
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-white rounded-lg border border-brand-border-subtle shadow-sm text-brand text-xs font-bold active:scale-[0.98] transition-transform"
        >
          <Search className="w-3.5 h-3.5" />
          {t("menu.search_on_google")}
        </a>
      </div>
    </div>
  );
}