"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { sectors } from "@/lib/content/sectors";

const COLORS = [
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-indigo-500",
  "from-lime-400 to-green-500",
  "from-orange-400 to-red-500",
  "from-teal-400 to-cyan-500",
  "from-fuchsia-400 to-pink-500",
  "from-indigo-400 to-blue-500",
];

export function SectorPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredSector = sectors.find((sector) => sector.slug === hovered);
  const router = useRouter();

  return (
    <div className="flex h-64 flex-col gap-2">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-2.5"
      >
        <div className="flex h-full flex-wrap content-start gap-2">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.slug}
              drag
              dragConstraints={containerRef}
              dragElastic={0.18}
              dragMomentum
              whileHover={{ scale: 1.08, zIndex: 20 }}
              whileTap={{ scale: 0.95, cursor: "grabbing" }}
              onHoverStart={() => setHovered(sector.slug)}
              onHoverEnd={() => setHovered((current) => (current === sector.slug ? null : current))}
              onClick={() => router.push(`/sektorler/${sector.slug}`)}
              className={`flex h-[58px] w-[86px] shrink-0 cursor-grab flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br text-white shadow-lg ${COLORS[index % COLORS.length]}`}
            >
              <sector.icon size={16} />
              <span className="px-1 text-center text-[9px] font-bold leading-tight">{sector.title}</span>
            </motion.div>
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
