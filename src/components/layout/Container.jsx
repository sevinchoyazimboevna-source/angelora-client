import { cn } from "@/lib/utils";

export default function Container({ children, className, size = "default" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "wide" && "max-w-editorial",
        size === "default" && "max-w-[1280px]",
        size === "narrow" && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}