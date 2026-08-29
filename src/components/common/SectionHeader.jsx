import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end",
        align === "center" && "sm:flex-col sm:items-center text-center",
        className
      )}
    >
      <div className={cn("space-y-3", action && "sm:flex-1")}>
        {eyebrow && (
          <div
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.18em] text-accent",
              align === "center" && "mx-auto"
            )}
          >
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-[1.05] tracking-tight text-balance">
          {title}
        </h2>
        {description && (
          <p className={cn("max-w-xl text-muted-foreground leading-relaxed", align === "center" && "mx-auto")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}