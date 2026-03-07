import { Info, X } from "lucide-react";
import AllergyCard from "./allergy-card";

export default function FoodCard() {
  return (
    <div className="collapse rounded-xl border-border border bg-background transition-all duration-300 ease-in-out has-checked:bg-brand-soft has-checked:border-brand-border group">
      <input type="checkbox" className="peer" />
      <div className="collapse-title p-3 min-h-0 flex flex-col gap-1">
        <div className="flex flex-row justify-between items-start">
          <h2 className="text-text text-h2 font-semibold">Spaghetti Carbonara</h2>
          <div className="p-1">
            <Info className="group-has-checked:hidden block text-brand w-4 h-4 font-light" />
            <X className="group-has-checked:block hidden text-brand w-4 h-4 font-light" />
          </div>
        </div>
        <span className="text-body text-text-muted leading-tight">Pecorino Romano, egg yolk, crispy guanciale</span>
      </div>
      <div className="collapse-content transition-all ease-in-out duration-300">
        <AllergyCard />
      </div>
    </div>
  );
}
