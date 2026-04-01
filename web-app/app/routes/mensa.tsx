import { mensaApi } from "~/lib/api/mensa";
import MensaCard from "~/components/mensa-card/card";
import type { Route } from "./+types/mensa";

export async function loader({ params }: Route.LoaderArgs) {
  const menu = await mensaApi.getMenu(params.slug);
  return { menu };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mensa Daily Menu" },
  ];
}

export default function MensaPage({ loaderData }: Route.ComponentProps) {
  const { menu } = loaderData;

  return (
    <MensaCard menu={menu} />
  );
}
