import { Construction } from "lucide-react";
import { useTranslation } from "~/lib/contexts/language-context";

export default function MaintenancePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-6 text-center px-6">
      <div className="bg-brand-soft p-4 rounded-full">
        <Construction className="w-12 h-12 text-brand" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-display font-bold text-text">{t("coming_soon.title")}</h1>
        <p className="text-body text-text-muted">{t("coming_soon.description")}</p>
      </div>
    </div>
  );
}
