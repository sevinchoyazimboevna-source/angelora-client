import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({ value, count, size = 14, showCount = true, className }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-border" style={{ width: size, height: size }} strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-foreground fill-foreground" style={{ width: size, height: size }} strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.toFixed(1)}
          {count != null && ` (${count})`}
        </span>
      )}
    </div>
  );
}