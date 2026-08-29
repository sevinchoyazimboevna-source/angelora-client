import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorState({ title = "Something went wrong", message, onRetry, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-20 px-6", className)}>
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-full border border-border bg-secondary">
        <AlertCircle className="h-6 w-6 text-muted-foreground" strokeWidth={1.25} />
      </div>
      <h3 className="font-heading text-lg font-medium tracking-tight">{title}</h3>
      {message && <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">{message}</p>}
      {onRetry && (
        <
// @ts-ignore
        Button variant="outline" onClick={onRetry} className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}