import { Link } from "react-router";
import { useTranslation } from "~/lib/contexts/language-context";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 flex justify-center items-center gap-1 flex-col text-body font-bold">
      <Link
        to="https://ege-okyay.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand"
      >
        {t("footer.built_by")}
      </Link>
      <span className="opacity-50 text-text-muted text-body-sm">
        {t("footer.no_affiliation")}
      </span>
    </footer>
  );
}
