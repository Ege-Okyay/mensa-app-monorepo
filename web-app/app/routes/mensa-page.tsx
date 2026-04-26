import { mensaApi } from "~/lib/api/mensa";
import MensaMenuCard from "~/components/mensa-menu-card/card";
import type { Route } from "./+types/mensa-page";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "~/lib/contexts/language-context";

export async function loader({ params }: Route.LoaderArgs) {
  const mensa = await mensaApi.getMensaWithMenu(params.slug);
  return { mensa };
}

export default function MensaPage({ loaderData }: Route.ComponentProps) {
  const { mensa } = loaderData;
  const imageUrl = `https://xoarqcxbowmkqvzchhde.supabase.co/storage/v1/object/public/mensas/${mensa.slug}.webp`;
  const { t } = useTranslation();

  if (!mensa.current_menu) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-6">
        <div className="bg-brand-soft p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-brand" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold text-text">{t("status.no_menu")}</h1>
          <p className="text-body text-text-muted">{t("status.no_menu_desc").replace("{name}", mensa.name)}</p>
        </div>
        <Link
          viewTransition
          to="/"
          className="btn h-12 px-4 rounded-2xl bg-brand text-white border-none shadow-lg transition-all active:scale-[0.98] group flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">{t("common.back_to_locations")}</span>
        </Link>
      </div>
    )
  }

  return (
    <>
      <title>{`Mensa Today - ${mensa.name}`}</title>

      <div className="w-full max-w-2xl h-full max-h-[85vh] flex flex-col gap-4">
        <MensaMenuCard
          menu={mensa.current_menu.menu_data}
          imageUrl={imageUrl}
        />
        
        <Link 
          viewTransition
          to="/"
          className="btn btn-ghost h-12 w-full rounded-2xl border-2 border-border/50 hover:bg-slate-100/50 text-text-muted transition-all active:scale-[0.98] group flex items-center justify-center gap-2">
          
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">{t("common.back_to_locations")}</span>
        </Link>
      </div>
    </>
  );
}
