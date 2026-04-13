import { 
  Milk, 
  Wheat, 
  Egg, 
  Fish, 
  Shell as Shellfish, 
  Nut as Peanut, 
  Nut, 
  Bean as Soy, 
  CircleDot as Sesame,
  AlertCircle
} from "lucide-react";

const iconMap: Record<string, any> = {
  "Gluten": Wheat,
  "Dairy": Milk,
  "Eggs": Egg,
  "Fish": Fish,
  "Shellfish": Shellfish,
  "Peanuts": Peanut,
  "Tree Nuts": Nut,
  "Soy": Soy,
  "Sesame": Sesame
};

interface AllergyProps {
  name: string;
}

export default function Allergy({ name }: AllergyProps) {
  const Icon = iconMap[name] || AlertCircle;

  return (
    <div className="pl-2 pr-2 pt-0.5 pb-0.5 flex justify-center items-center bg-background border border-border rounded shrink-0 shadow-sm">
      <div className="flex flex-row items-center gap-1.5">
        <Icon className="w-3 h-3 text-brand" />
        <span className="text-text font-semibold text-body-sm uppercase tracking-wider">{name}</span>
      </div>
    </div>
  );
}
