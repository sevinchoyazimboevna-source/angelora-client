import { cn } from "@/lib/utils";

const METAL_HEX = {
  Gold: "#D4AF6A",
  "Rose Gold": "#E8B9A1",
  Silver: "#C9CCCF",
  Platinum: "#DDE0E3",
};

export default function MetalSwatch({ metal, selected, onClick, size = 32, label = true }) {
  const hex = METAL_HEX[metal] || "#C9CCCF";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={metal}
      aria-pressed={selected}
      className="group flex flex-col items-center gap-2"
    >
      <span
        className={cn(
          "rounded-full ring-1 ring-border transition-all ease-lux",
          selected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "group-hover:ring-foreground/30"
        )}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 30%, #fff 0%, ${hex} 55%, ${hex}99 100%)`,
          boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.18)",
        }}
      />
      {label && (
        <span className={cn("text-[11px] uppercase tracking-wide", selected ? "text-foreground" : "text-muted-foreground")}>
          {metal}
        </span>
      )}
    </button>
  );
}