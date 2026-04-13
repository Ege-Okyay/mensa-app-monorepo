import type { MenuItem } from "~/lib/api/types";

interface SideDishProps {
  menuItem: MenuItem;
}

export default function SideDish({ menuItem }: SideDishProps) {
  return (
    <div className="rounded-xl border-border border-2 border-dotted bg-background w-full p-3 flex flex-col gap-1">
      <h2 className="text-text text-h2 font-bold leading-tight">{menuItem.en.name}</h2>
      <span className="text-body text-text-muted leading-tight">{menuItem.en.description}</span>
    </div>
  );
}
