import { Milk } from "lucide-react";

export default function Allergy() {
  return (
    <div className="pl-2 pr-2 pt-0.5 pb-0.5 flex justify-center items-center bg-background border border-border rounded shrink-0">
      <div className="flex flex-row items-center gap-1">
        <Milk className="w-3 h-3 text-brand text-light" />
        <span className="text-text font-medium text-body-sm">Dairy</span>
      </div>
    </div>
  );
}
