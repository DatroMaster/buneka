"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sectors } from "@/lib/content/sectors";

const COLORS = [
  "from-cyan-600 to-blue-700",
  "from-emerald-600 to-teal-700",
  "from-amber-500 to-orange-700",
  "from-rose-600 to-pink-700",
  "from-violet-600 to-purple-700",
  "from-sky-600 to-indigo-700",
  "from-lime-600 to-green-700",
  "from-orange-600 to-red-700",
  "from-teal-600 to-cyan-700",
  "from-fuchsia-600 to-pink-700",
  "from-indigo-600 to-blue-700",
];

export function SectorPlayground({ excludeSlugs = [] }: { excludeSlugs?: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const visibleSectors = sectors.filter((sector) => !excludeSlugs.includes(sector.slug));
  const hoveredSector = visibleSectors.find((sector) => sector.slug === hovered);
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="relative min-h-[360px] flex-1 overflow-y-auto rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-2.5 sm:min-h-0">
        <div className="grid auto-rows-[minmax(92px,1fr)] grid-cols-2 gap-2 sm:h-full sm:grid-cols-5">
          {visibleSectors.map((sector, index) => (
            <motion.button
              key={sector.slug}
              type="button"
              whileHover={{ scale: 1.06, zIndex: 20 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setHovered(sector.slug)}
              onHoverEnd={() => setHovered((current) => (current === sector.slug ? null : current))}
              onFocus={() => setHovered(sector.slug)}
              onClick={() => router.push(`/sektorler/${sector.slug}`)}
              className={`flex min-h-[92px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br px-1 text-white shadow-md ring-1 ring-black/15 ${COLORS[index % COLORS.length]}`}
            >
              <sector.icon size={22} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" />
              <span className="px-1 text-center text-[11px] font-extrabold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {sector.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative h-11 shrink-0 overflow-hidden rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface)] px-3">
        <AnimatePresence mode="wait">
          {hoveredSector ? (
            <motion.div
              key={hoveredSector.slug}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center gap-2"
            >
              <hoveredSector.icon size={14} className="shrink-0 text-[color:var(--home-glow)]" />
              <p className="truncate text-[11px] leading-tight text-[color:var(--home-ink)]">
                <span className="font-bold">{hoveredSector.title}:</span> {hoveredSector.short}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center text-[11px] text-[color:var(--home-muted)]"
            >
              Bir sektörün üzerine gelin, tıklayınca sayfasına gidersiniz.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
