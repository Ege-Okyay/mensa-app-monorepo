import { useTranslation } from "~/lib/contexts/language-context";
import { privacyContent } from "~/lib/legal-content";
import LegalPageView from "~/components/legal-page";

export default function Privacy() {
  const { language } = useTranslation();
  const page = privacyContent[language];

  return (
    <>
      <title>Privacy Policy - MensaToday</title>
      <LegalPageView page={page} />
    </>
  );
}