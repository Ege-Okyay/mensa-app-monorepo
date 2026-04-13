import { Clock, Zap } from "lucide-react";
import SectionTitle from "./section-title";
import FoodCard from "./food-card";
import SideDish from "./side-dish";
import Allergy from "./allergy";
import type { MenuData } from "~/lib/api/types";

interface MensaMenuCardProps {
  menu: MenuData;
  imageUrl: string;
}

export default function MensaMenuCard({ menu, imageUrl }: MensaMenuCardProps) {
  return (
    <div className="card bg-white w-full rounded-2xl shadow-sm overflow-y-auto h-[80svh] border border-border no-scrollbar flex flex-col">
      <figure className="relative h-32 w-full shrink-0">
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt={`${menu.mensa_name} header image`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end justify-start">
          <div className="mb-3 ml-4 mr-4 flex flex-row items-end justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-white font-bold text-h1 leading-tight">Mensa {menu.mensa_name}</h2>
            </div>
            {menu.specialties_available && (
              <div className="bg-brand px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm mb-0.5">
                <Zap className="w-3 h-3 text-white fill-white" />
                <span className="text-white font-semibold text-body-sm uppercase tracking-tighter">Specialties Available</span>
              </div>
            )}
          </div>
        </div>
      </figure>

      {menu.common_allergens?.length > 0 && (
        <div className="px-4 pt-4 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-body-sm font-bold text-text-muted uppercase tracking-[0.15em]">Common Allergens</span>
            <div className="flex flex-row gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {menu.common_allergens.map((allergen) => (
                <Allergy key={allergen} name={allergen} />
              ))}
            </div>
          </div>
          <div className="divider m-0 mt-2 h-px opacity-50"></div>
        </div>
      )}

      <div className="flex-1 px-3 pb-6">
        <div className="space-y-6">
          <div>
            <SectionTitle title="FIRST COURSES" />
            <div className="flex flex-col gap-2.5">
              {menu.first_courses.map((course, index) => (
                <FoodCard key={index} menuItem={course} />
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="MAIN COURSES" />
            <div className="flex flex-col gap-2.5">
              {menu.main_courses.map((course, index) => (
                <FoodCard key={index} menuItem={course} />
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="SIDE DISHES" />
            <div className="flex flex-col gap-2.5">
              {menu.side_dishes.map((course, index) => (
                <SideDish key={index} menuItem={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
