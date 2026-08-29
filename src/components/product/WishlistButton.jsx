import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist, selectIsWishlisted } from "@/store/wishlist";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function WishlistButton({ productId, className, size = 18, label }) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => selectIsWishlisted(s, productId));
  const { toast } = useToast();

  const handle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(productId));
    toast({
      description: active ? "Removed from wishlist" : "Added to wishlist",
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors ease-lux",
        "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <span className="relative grid place-items-center" style={{ width: size, height: size }}>
        <Heart strokeWidth={1.5} style={{ width: size, height: size }} className={cn(active && "fill-accent text-accent")} />
        <AnimatePresence>
          {!active && null}
        </AnimatePresence>
        <AnimatePresence>
          {active && (
            <motion.span
              key="ping"
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-full ring-1 ring-accent"
            />
          )}
        </AnimatePresence>
      </span>
      {label && <span className="ml-2 text-sm">{active ? "Saved" : "Save"}</span>}
    </button>
  );
}