import { Settings, Bell, Globe, Check, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation, type Language } from "~/lib/contexts/language-context";
import { usePushNotifications } from "~/lib/hooks/use-push-notification";

const languages = [
  { code: "it", name: "Italiano" },
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
];

export default function SettingsDropdown() {
  const { language, setLanguage, t } = useTranslation();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

  const { isSupported, isSubscribed, subscribe, unsubscribe, loading } = usePushNotifications(vapidPublicKey)

  const handleLanguageSelect = (code: string) => setLanguage(code as Language);

  const handleNotificationToggle = () => {
    if (loading) return;

    if (isSubscribed) unsubscribe();
    else subscribe();
  };

  return (
    <details ref={detailsRef} className="dropdown dropdown-end group">
      <summary className="btn flex list-none flex-row items-center justify-center w-11 h-11 rounded-2xl border-2 border-border bg-white p-0 font-bold text-text active:scale-95 transition-all shadow-sm cursor-pointer border-b-4">
        <Settings className="w-5 h-5 text-brand group-open:rotate-90 transition-transform duration-300" />
      </summary>

      <div className="dropdown-content z-100 mt-3 w-72 rounded-3xl border-2 border-border bg-white p-4 shadow-xl right-0">
        <div className="flex flex-col gap-6">
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Globe className="w-4 h-4 text-brand" />
              <h3 className="font-bold text-sm text-text">{t("settings.language")}</h3>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${language === lang.code
                    ? "bg-brand-soft text-brand font-bold"
                    : "text-text-muted hover:bg-background"
                    }`}
                >
                  {lang.name}
                  {language === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand" />
                <h3 className="font-bold text-sm text-text">{t("settings.notifications")}</h3>
              </div>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-brand" />}
            </div>

            <p className="text-body-sm text-text-muted px-1 mb-3 leading-tight">
              {t("settings.notifications_desc")}
            </p>

            {isSupported ? (
              <button
                onClick={handleNotificationToggle}
                disabled={loading}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all border-2
                  ${isSubscribed
                    ? "bg-white border-brand text-brand font-bold"
                    : "bg-brand text-white border-brand font-bold"} 
                  disabled:opacity-50 active:scale-95
                  ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-50"}`}
              >
                <span>{t("settings.push_notifications")}</span>

                <div className={`w-8 h-4 rounded-full relative transition-colors ${isSubscribed ? "bg-brand" : "bg-gray-300"}`}>
                  <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isSubscribed ? "right-1" : "left-1"}`} />
                </div>
              </button>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-background text-text-muted text-body-sm italic">
                {t("settings.not_supported")}
              </div>
            )}
          </section>
        </div>
      </div>
    </details>
  );
}
