import { useTranslation } from "~/lib/contexts/language-context";
import { termsContent } from "~/lib/legal-content";
import LegalPageView from "~/components/legal-page";

export default function Terms() {
  const { language } = useTranslation();
  const page = termsContent[language];

  return (
    <>
      <title>Terms of Service - MensaToday</title>
      <LegalPageView page={page} />
    </>
  );
}