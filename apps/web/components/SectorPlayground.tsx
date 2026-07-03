"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sectors } from "@/lib/content/sectors";

export function SectorPlayground({ excludeSlugs = [] }: { excludeSlugs?: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const visibleSectors = sectors.filter((sector) => !excludeSlugs.includes(sector.slug));
  const hoveredSector = visibleSectors.find((sector) => sector.slug === hovered);
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="relative min-h-[360px] flex-1 overflow-y-auto rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-2.5 sm:min-h-0">
        <div className="grid auto-rows-[minmax(82px,1fr)] grid-cols-1 gap-2 sm:h-full sm:grid-cols-5 sm:auto-rows-[minmax(92px,1fr)]">
          {visibleSectors.map((sector) => (
            <motion.button
              key={sector.slug}
              type="button"
              whileHover={{ scale: 1.02, zIndex: 20 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setHovered(sector.slug)}
              onHoverEnd={() => setHovered((current) => (current === sector.slug ? null : current))}
              onFocus={() => setHovered(sector.slug)}
              onClick={() => router.push(`/sektorler/${sector.slug}`)}
              className="group relative flex min-h-[82px] w-full max-w-full cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-emerald-300/18 bg-gradient-to-br from-[#1F2A24] via-[#151C18] to-[#0B0D0C] px-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_34px_rgba(0,0,0,0.22)] transition-colors hover:border-emerald-300/60 sm:min-h-[92px]"
            >
              <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
              <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-300/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <sector.icon size={22} className="relative text-emerald-200 drop-shadow-[0_0_10px_rgba(62,207,142,0.22)]" />
              <span className="max-w-full px-1 text-center text-[11px] font-extrabold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
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
