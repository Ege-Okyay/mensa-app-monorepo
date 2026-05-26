import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "~/lib/contexts/language-context";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-16 h-16 bg-brand-soft rounded-3xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-brand" />
      </div>
      <h2 className="text-h1 font-bold text-text mb-2">{t("errors.title")}</h2>
      <p className="text-body text-text-muted mb-6 max-w-50">{message || t("errors.unexpected")}</p>

      <div className="flex flex-col gap-2 w-full">
        {onRetry && (
          <button onClick={onRetry} className="bg-brand text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            <RefreshCw className="w-4 h-4" />
            {t("errors.try_again")}
          </button>
        )}

        <Link
          viewTransition
          to="/"
          className="btn btn-ghost h-12 w-full rounded-2xl border-2 border-border/50 hover:bg-slate-100/50 text-text-muted transition-all active:scale-[0.98] group flex items-center justify-center gap-2">
          
          <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">{t("errors.back_home")}</span>
        </Link>
      </div>
    </div>
  );
};
