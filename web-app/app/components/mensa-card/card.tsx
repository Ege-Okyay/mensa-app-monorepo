import { Clock } from "lucide-react";
import SectionTitle from "./section-title";
import FoodCard from "./food-card";
import SideDish from "./side-dish";

export default function MensaCard() {
  return (
    <div className="card bg-white w-full rounded-2xl shadow-sm overflow-y-auto overflow-x-auto h-[80svh]">
      <figure className="relative h-36 shrink-0">
        <img
          className="w-full h-full object-cover"
          src="https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk"
        />
        <div className="absolute inset-0 bg-black/25 flex items-end justify-start">
          <div className="mb-4 ml-3 flex flex-col gap-1 justify-center">
            <h2 className="text-white font-semibold text-h1">Mensa Casterfidaldo</h2>
            <div className="flex flex-row items-center gap-2 text-white">
              <Clock className="w-3 h-3 font-light" />
              <span className="font-light text-body">Open until 15:00</span>
            </div>
          </div>
        </div>
      </figure>
      <div className="ml-3 mr-3 flex-1 pb-4 scrollbar-hide">
        <SectionTitle title="FIRST COURSES" />
        <div className="w-full flex flex-col gap-2 items-center">
          <FoodCard />
          <FoodCard />
          <FoodCard />
        </div>
      </div>
      <div className="ml-3 mr-3 flex-1 pb-4 scrollbar-hide">
        <SectionTitle title="MAIN COURSES" />
        <div className="w-full flex flex-col gap-2 items-center">
          <FoodCard />
          <FoodCard />
          <FoodCard />
        </div>
      </div>
      <div className="ml-3 mr-3 flex-1 pb-4 scrollbar-hide">
        <SectionTitle title="SIDE DISHES" />
        <div className="grid grid-cols-2 gap-2">
          <SideDish />
          <SideDish />
        </div>
      </div>
    </div>
  );
}
