import { Link } from "react-router";
import type { Route } from "./+types/index";
import { mensaApi } from "~/lib/api/mensa";
import { MensaCard } from "~/components/mensa-card/card";

export async function loader() {
  const mensas = await mensaApi.getAll();
  return { mensas };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { mensas } = loaderData;

  const sortedMensas = [...mensas].sort((a, b) => {
    const aPublished = a.current_menu !== null;
    const bPublished = b.current_menu !== null;

    if (aPublished === bPublished) {
      return a.name.localeCompare(b.name);
    }
    
    return aPublished ? -1 : 1
  });

  return (
    <>
      <title>Mensa Today</title>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-display font-bold text-text tracking-tight">Locations</h2>
          <p className="text-body-sm text-text-muted font-semibold uppercase tracking-widest">Pick a canteen</p>
        </div>

        <div className="flex flex-col gap-8">
          {sortedMensas.map((mensa) => {
            const isPublished = mensa.current_menu !== null;
            const imageUrl = `https://xoarqcxbowmkqvzchhde.supabase.co/storage/v1/object/public/mensas/${mensa.slug}.webp`;

            return (
              <div
                key={mensa.id}
                className={`w-full transition-all duration-200 ${isPublished ? "active:scale-[0.98]" : "opacity-60"}`}
              >
                {isPublished ? (
                  <Link to={`/mensa/${mensa.slug}`} className="block group">
                    <MensaCard
                      mensa={mensa}
                      isPublished={isPublished}
                      imageUrl={imageUrl}
                    />
                  </Link>
                ) : (
                  <div className="block cursor-not-allowed">
                    <MensaCard
                      mensa={mensa}
                      isPublished={isPublished}
                      imageUrl={imageUrl}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
