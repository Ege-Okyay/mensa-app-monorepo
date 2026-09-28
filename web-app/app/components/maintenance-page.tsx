import { Construction } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-6 text-center px-6">
      <div className="bg-brand-soft p-4 rounded-full">
        <Construction className="w-12 h-12 text-brand" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-display font-bold text-text">We are working on it</h1>
        <p className="text-body text-text-muted">This page is under construction. Check back soon.</p>
      </div>
    </div>
  );
}
