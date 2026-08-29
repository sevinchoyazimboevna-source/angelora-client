// @ts-nocheck
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-20 px-6", className)}>
      {Icon && (
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-border bg-secondary">
          <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.25} />
        </div>
      )}
      <h3 className="font-display text-2xl font-medium tracking-tight">{title}</h3>
      {description && <p className="mt-3 max-w-sm text-muted-foreground leading-relaxed">{description}</p>}
      {actionLabel &&
        (actionTo ? (
          <
// @ts-ignore
          Button asChild className="mt-8 h-11 px-7">
            <Link to={actionTo}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction} className="mt-8 h-11 px-7">
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}