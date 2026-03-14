import type { Route } from "./+types/index";
import MensaCard from "~/components/mensa-card/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mensa Daily Menu" },
  ];
}

export default function Index() {
  return (
    <MensaCard />
  );
}
