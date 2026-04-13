import { mensaApi } from "~/lib/api/mensa";
import MensaMenuCard from "~/components/mensa-menu-card/card";
import type { Route } from "./+types/mensa-page";

export async function loader({ params }: Route.LoaderArgs) {
  const menu = await mensaApi.getMenu(params.slug);
  return { menu, slug: params.slug };
}

export default function MensaPage({ loaderData }: Route.ComponentProps) {
  const { menu, slug } = loaderData;
  const imageUrl = `https://xoarqcxbowmkqvzchhde.supabase.co/storage/v1/object/public/mensas/${slug}.webp`;

  return (
    <>
      <title>{`Mensa Today - ${menu.mensa_name}`}</title>

      <MensaMenuCard
        menu={menu}
        imageUrl={imageUrl}
      />
    </>
  );
}
