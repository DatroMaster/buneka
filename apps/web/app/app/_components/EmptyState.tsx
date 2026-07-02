import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, message }: { icon?: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-10 text-center text-slate-500">
      {Icon && <Icon size={32} className="text-slate-300" />}
      <p className="font-medium">{message}</p>
    </div>
  );
}
