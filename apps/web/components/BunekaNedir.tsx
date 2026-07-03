"use client";

import {
  Boxes,
  CheckCircle2,
  PhoneCall,
  PhoneOff,
  PlayCircle,
  RotateCcw,
  ScanLine,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { callLink } from "@/lib/contact";

const SCENE_MS = 5000;
const SCENE_COUNT = 3;

type Variant = "pill" | "compact";

export function BunekaNedirButton({
  className = "",
  variant = "pill",
}: {
  className?: string;
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);

  const start = useCallback(() => {
    setScene(0);
    setPlaying(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    setScene(0);
    setPlaying(true);
  }, []);

  // Auto-advance through the scenes; stops on the final scene.
  useEffect(() => {
    if (!open || !playing) return;
    if (scene >= SCENE_COUNT - 1) return;
    const id = window.setTimeout(() => setScene((current) => current + 1), SCENE_MS);
    return () => window.clearTimeout(id);
  }, [open, playing, scene]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const isLast = scene >= SCENE_COUNT - 1;

  return (
    <>
      <button
        type="button"
        onClick={start}
        aria-label="Buneka nedir? 15 saniyelik tanıtım"
        className={
          variant === "compact"
            ? `flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--home-border)] text-[color:var(--home-glow)] transition-all hover:border-[color:var(--home-glow)] active:scale-90 ${className}`
            : `group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--home-border)] px-3 py-1.5 text-xs font-bold text-[color:var(--home-ink)] transition-all hover:border-[color:var(--home-glow)] active:scale-95 ${className}`
        }
      >
        <PlayCircle size={variant === "compact" ? 18 : 15} className="text-[color:var(--home-glow)]" />
        {variant === "pill" && <span className="hidden sm:inline">Buneka Nedir?</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm" onClick={close}>
          <div
            className="bn-modal relative my-auto flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[color:var(--home-border)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Buneka nedir tanıtımı"
          >
            {/* Progress segments */}
            <div className="flex items-center gap-1.5 px-4 pt-4">
              {Array.from({ length: SCENE_COUNT }).map((_, index) => (
                <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-[color:var(--home-border)]">
                  <div
                    key={`${index}-${scene}-${playing}`}
                    className="h-full rounded-full bg-[color:var(--home-glow)]"
                    style={{
                      width: index < scene ? "100%" : index > scene ? "0%" : undefined,
                      animation:
                        index === scene && playing && !isLast
                          ? `bn-progress ${SCENE_MS}ms linear forwards`
                          : index === scene
                            ? undefined
                            : "none",
                      ...(index === scene && (isLast || !playing) ? { width: "100%" } : {}),
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={close}
                aria-label="Kapat"
                className="ml-1 shrink-0 rounded-full p-1 text-[color:var(--home-muted)] transition-colors hover:text-[color:var(--home-ink)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stage */}
            <div className="relative flex min-h-[300px] flex-col items-center justify-center gap-4 px-6 py-8 text-center sm:min-h-[340px]">
              {scene === 0 && <SceneProblem />}
              {scene === 1 && <SceneSolution />}
              {scene === 2 && <SceneResult onCta={close} />}
            </div>

            {/* Footer controls */}
            <div className="flex items-center justify-between gap-2 border-t border-[color:var(--home-border)] px-4 py-3">
              <div className="flex gap-1.5">
                {Array.from({ length: SCENE_COUNT }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setScene(index);
                      setPlaying(index < SCENE_COUNT - 1);
                    }}
                    aria-label={`${index + 1}. sahne`}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === scene ? "bg-[color:var(--home-glow)]" : "bg-[color:var(--home-border)]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={replay}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--home-muted)] transition-colors hover:text-[color:var(--home-ink)]"
              >
                <RotateCcw size={13} /> Baştan oynat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SceneTag({ tone, label }: { tone: "problem" | "solution" | "result"; label: string }) {
  const styles =
    tone === "problem"
      ? "border-amber-400/40 text-amber-400"
      : tone === "solution"
        ? "border-emerald-400/40 text-emerald-400"
        : "border-[color:var(--home-glow)]/40 text-[color:var(--home-glow)]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${styles}`}>
      {label}
    </span>
  );
}

function SceneProblem() {
  return (
    <>
      <div className="bn-pop relative flex h-24 w-24 items-center justify-center">
        <span className="bn-ring absolute inset-0 rounded-full border-2 border-amber-400/50" />
        <span className="bn-ring absolute inset-0 rounded-full border-2 border-amber-400/40" style={{ animationDelay: "0.9s" }} />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
          <PhoneOff size={30} />
        </div>
        <span className="bn-float absolute -right-2 -top-1 text-lg font-black text-amber-400">?</span>
        <span className="bn-float absolute -left-3 top-4 text-sm font-black text-amber-400" style={{ animationDelay: "0.6s" }}>
          ₺?
        </span>
      </div>
      <SceneTag tone="problem" label="Sorun" />
      <h3 className="font-display text-xl font-bold leading-tight text-[color:var(--home-ink)] sm:text-2xl">
        Sen dükkanda yokken <span className="text-amber-400">&quot;Bu Ne Kadar?&quot;</span> sorusu beklemez.
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-[color:var(--home-muted)]">
        Fiyat bilgisi tek kişiye bağlı kalmaz. Çalışan barkodu okutur, cevabı hemen görür.
      </p>
    </>
  );
}

function SceneSolution() {
  return (
    <>
      <div className="bn-pop flex w-full max-w-xs flex-col items-center gap-3">
        <div className="relative flex h-16 w-52 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/5">
          <div className="flex items-end gap-[3px]">
            {[10, 4, 8, 3, 9, 5, 7, 4, 10, 6, 3, 8, 5, 9].map((h, index) => (
              <span key={index} className="w-[3px] rounded-sm bg-[color:var(--home-ink)]" style={{ height: `${h * 3}px` }} />
            ))}
          </div>
          <span className="bn-scan absolute inset-y-1 left-2 w-[2px] rounded bg-[color:var(--home-glow)]" />
        </div>
        <div className="bn-pop flex items-center gap-2 text-2xl font-black text-[color:var(--home-glow)]" style={{ animationDelay: "0.5s" }}>
          ₺24,68
          <CheckCircle2 size={22} className="text-emerald-400" />
        </div>
      </div>
      <SceneTag tone="solution" label="Çözüm" />
      <h3 className="font-display text-xl font-bold leading-tight text-[color:var(--home-ink)] sm:text-2xl">
        Barkodu okut. Fiyatı gör. <span className="text-[color:var(--home-glow)]">Satış hareketlerini takip et.</span>
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[color:var(--home-muted)]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--home-border)] px-2.5 py-1">
          <ScanLine size={12} className="text-[color:var(--home-glow)]" /> Fiyat
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--home-border)] px-2.5 py-1">
          <WalletCards size={12} className="text-[color:var(--home-glow)]" /> Kasa
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--home-border)] px-2.5 py-1">
          <Boxes size={12} className="text-[color:var(--home-glow)]" /> Stok
        </span>
      </div>
    </>
  );
}

function SceneResult({ onCta }: { onCta: () => void }) {
  return (
    <>
      <div className="bn-pop relative flex h-24 w-24 items-center justify-center">
        <span className="bn-ring absolute inset-0 rounded-full border-2 border-[color:var(--home-glow)]/40" />
        <BunekaMark size={56} />
      </div>
      <SceneTag tone="result" label="Buneka" />
      <h3 className="font-display text-xl font-bold leading-tight text-[color:var(--home-ink)] sm:text-2xl">
        Dükkanının hafızası artık <span className="text-[color:var(--home-glow)]">cebinde.</span>
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-[color:var(--home-muted)]">
        Kurulum yok, karmaşa yok. Fiyat, kasa, stok ve hareket hafızası aynı yerde toplansın.
      </p>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <a
          href={callLink()}
          onClick={onCta}
          className="cta-call-spark inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-black"
        >
          <PhoneCall size={15} /> Hemen Arayın
        </a>
      </div>
    </>
  );
}


export function BunekaExplainerCard() {
  return (
    <div className="bn-square-video glow-border relative mx-auto grid aspect-[16/9] w-full max-w-[620px] place-items-center overflow-hidden rounded-2xl bg-[color:var(--home-surface)]/80 p-3 backdrop-blur-xl sm:p-4">
      <div aria-hidden className="bn-square-grid absolute inset-0" />
      <div aria-hidden className="bn-square-orbit absolute inset-[7%] rounded-[1.5rem]" />
      <div className="relative z-10 grid h-full w-full place-items-center rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/70 p-4 text-center">
        <div className="bn-pop flex h-full w-full flex-col justify-center gap-3 text-left">
          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
              <span className="bn-ring absolute inset-0 rounded-full border-2 border-[color:var(--home-glow)]/40" />
              <BunekaMark size={54} />
            </div>
            <div className="min-w-0">
              <SceneTag tone="result" label="Buneka sistemi" />
              <h2 className="font-display mt-3 text-2xl font-black leading-tight text-[color:var(--home-ink)] sm:text-3xl">
                Bu Ne Kadar?
              </h2>
            </div>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-3">
            {[
              ['1', 'Barkodu okut'],
              ['2', 'Fiyatı gör'],
              ['3', 'Satış hareketlerini takip et'],
            ].map(([step, label]) => (
              <div key={step} className="flex items-center gap-2 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-xs font-black text-slate-950">
                  {step}
                </span>
                <span className="text-xs font-bold leading-snug text-[color:var(--home-ink)] sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BunekaStoryCard() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const isLast = scene >= SCENE_COUNT - 1;

  useEffect(() => {
    if (!playing || isLast) return;
    const id = window.setTimeout(() => setScene((current) => current + 1), SCENE_MS);
    return () => window.clearTimeout(id);
  }, [isLast, playing, scene]);

  const replay = () => {
    setScene(0);
    setPlaying(true);
  };

  return (
    <div className="bn-modal glow-border relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-1.5 px-4 pt-4">
        {Array.from({ length: SCENE_COUNT }).map((_, index) => (
          <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-[color:var(--home-border)]">
            <div
              key={`${index}-${scene}-${playing}`}
              className="h-full rounded-full bg-[color:var(--home-glow)]"
              style={{
                width: index < scene ? "100%" : index > scene ? "0%" : undefined,
                animation: index === scene && playing && !isLast ? `bn-progress ${SCENE_MS}ms linear forwards` : index === scene ? undefined : "none",
                ...(index === scene && (isLast || !playing) ? { width: "100%" } : {}),
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-6 text-center">
        {scene === 0 && <SceneProblem />}
        {scene === 1 && <SceneSolution />}
        {scene === 2 && <SceneResult onCta={() => setPlaying(false)} />}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[color:var(--home-border)] px-4 py-3">
        <div className="flex gap-1.5">
          {Array.from({ length: SCENE_COUNT }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setScene(index);
                setPlaying(index < SCENE_COUNT - 1);
              }}
              aria-label={`${index + 1}. sahne`}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === scene ? "bg-[color:var(--home-glow)]" : "bg-[color:var(--home-border)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--home-muted)] transition-colors hover:text-[color:var(--home-ink)]"
        >
          <RotateCcw size={13} /> Baştan oynat
        </button>
      </div>
    </div>
  );
}
