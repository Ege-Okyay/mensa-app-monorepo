import Allergy from "./allergy";

export default function AllergyCard() {
  return (
    <div className="bg-white rounded border border-brand-border-subtle pl-3 pr-3 pt-2 pb-2 flex flex-col justify-between gap-2">
      <span className="text-brand font-semibold text-body">ALLERGY INFORMATION</span>
      <div className="flex flex-row gap-1 overflow-x-auto">
        <Allergy />
        <Allergy />
        <Allergy />
        <Allergy />
        <Allergy />
        <Allergy />
      </div>
    </div>
  );
}
