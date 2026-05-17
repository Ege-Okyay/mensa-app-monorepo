import { Link } from "react-router";
import type { Route } from "./+types/index";
import { mensaApi } from "~/lib/api/mensa";
import { MensaCard } from "~/components/mensa-card/card";
import { useTranslation } from "~/lib/contexts/language-context";
import { getOptimizedImageUrl } from "~/lib/utils/image";
import Footer from "~/components/footer";

export async function clientLoader() {
  const mensas = await mensaApi.getAll();
  return { mensas };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { mensas } = loaderData;
  const { t } = useTranslation();

  const sortedMensas = [...mensas].sort((a, b) => {
    if (a.has_menu === b.has_menu) {
      return a.name.localeCompare(b.name);
    }
    
    return a.has_menu ? -1 : 1
  });

  return (
    <>
      <title>MensaToday</title>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-display font-bold text-text tracking-tight">{t("common.locations")}</h2>
          <p className="text-body-sm text-text-muted font-semibold uppercase tracking-widest">{t("common.pick_a_mensa")}</p>
        </div>

        <div className="flex flex-col gap-8">
          {sortedMensas.map((mensa) => {
            const imageUrl = getOptimizedImageUrl(mensa.slug, 1200);

            return (
              <div
                key={mensa.id}
                className={`w-full transition-all duration-200 ${mensa.has_menu ? "active:scale-[0.98]" : "opacity-60"}`}
              >
                {mensa.has_menu ? (
                  <Link
                    viewTransition
                    to={`/mensa/${mensa.slug}`}
                    className="block group"
                  >
                    <MensaCard
                      mensa={mensa}
                      hasMenu={mensa.has_menu}
                      imageUrl={imageUrl}
                    />
                  </Link>
                ) : (
                  <div className="block cursor-not-allowed">
                    <MensaCard
                      mensa={mensa}
                      hasMenu={mensa.has_menu}
                      imageUrl={imageUrl}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
