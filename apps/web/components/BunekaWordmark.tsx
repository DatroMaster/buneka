export function BunekaWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extralight uppercase tracking-[0.25em] ${className}`}>
      <span aria-hidden="true">
        BUNEK<span>&Lambda;</span>
      </span>
      <span className="sr-only">Buneka</span>
    </span>
  );
}
