"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

/** True only after the client has hydrated — avoids a server/client mismatch on the icon. */
function useHasMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aydınlık moda geç" : "Karanlık moda geç"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-90 ${className}`}
    >
      {mounted ? isDark ? <Sun size={16} /> : <Moon size={16} /> : <Moon size={16} />}
    </button>
  );
}
