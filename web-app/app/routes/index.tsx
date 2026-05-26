import { Link } from "react-router";
import type { Route } from "./+types/index";
import { mensaApi } from "~/lib/api/mensa";
import { MensaCard } from "~/components/mensa-card/card";
import { useTranslation } from "~/lib/contexts/language-context";
import { getOptimizedImageUrl } from "~/lib/utils/image";
import Footer from "~/components/footer";
import { useStarredMensas } from "~/lib/hooks/use-starred-mensas";
import { isApiError } from "~/lib/api/client";
import { ErrorView } from "~/components/error-view";

export async function clientLoader() {
  const mensas = await mensaApi.getAll();
  return { mensas };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { mensas } = loaderData;
  const { t } = useTranslation();
  const { isStarred, toggleStar } = useStarredMensas();

  const sortedMensas = [...mensas].sort((a, b) => {
    const aStarred = isStarred(a.id);
    const bStarred = isStarred(b.id);

    if (aStarred !== bStarred) {
      return aStarred ? -1 : 1;
    }

    if (a.has_menu === b.has_menu) {
      return a.name.localeCompare(b.name);
    }

    return a.has_menu ? -1 : 1;
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
              <div key={mensa.id} className="relative w-full">
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
                      isStarred={isStarred(mensa.id)}
                      onStarToggle={() => toggleStar(mensa.id)}
                    />
                  </Link>
                ) : (
                  <div className="block group cursor-not-allowed">
                    <MensaCard
                      mensa={mensa}
                      hasMenu={mensa.has_menu}
                      imageUrl={imageUrl}
                      isStarred={isStarred(mensa.id)}
                      onStarToggle={() => toggleStar(mensa.id)}
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t("errors.unexpected");

  if (isApiError(error)) {
    if (error.code === "TIMEOUT") message = t("errors.timeout");
    else if (error.code === "NETWORK_ERROR") message = t("errors.connection");
    else if (error.code === "SERVER_OFFLINE") message = t("errors.offline");
    else message = error.message;
  }

  return (
    <div className="mt-10">
      <ErrorView
        message={message}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
