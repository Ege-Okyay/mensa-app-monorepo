import { mensaApi } from "~/lib/api/mensa";
import MensaMenuCard from "~/components/mensa-menu-card/card";
import type { Route } from "./+types/mensa-page";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const mensa = await mensaApi.getMensaWithMenu(params.slug);
  return { mensa };
}

export default function MensaPage({ loaderData }: Route.ComponentProps) {
  const { mensa } = loaderData;
  const imageUrl = `https://xoarqcxbowmkqvzchhde.supabase.co/storage/v1/object/public/mensas/${mensa.slug}.webp`;

  if (!mensa.current_menu) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-6">
        <div className="bg-brand-soft p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-brand" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold text-text">No Menu Found</h1>
          <p className="text-body text-text-muted">Today's menu for {mensa.name} hasn't been published yet.</p>
        </div>
        <Link to="/" className="btn btn-brand rounded-2xl gap-2 shadow-lg shadow-brand/20">
          <ArrowLeft className="w-4 h-4" />
          Back to Locations
        </Link>
      </div>
    )
  }

  return (
    <>
      <title>{`Mensa Today - ${mensa.name}`}</title>

      <div className="w-full max-w-2xl h-full max-h-[85vh] flex">
        <MensaMenuCard
          menu={mensa.current_menu.menu_data}
          imageUrl={imageUrl}
        />
      </div>
    </>
  );
}
