import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import Container from "./Container";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cart";
import { selectWishlistCount } from "@/store/wishlist";
import { useAuth } from "@/lib/AuthContext";
import SearchOverlay from "./SearchOverlay";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/jewelry", label: "Jewelry" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
];

function CountBadge({ count }) {
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 ease-lux",
          scrolled ? "bg-background/85 backdrop-blur-[20px] border-b border-border" : "bg-background border-b border-transparent"
        )}
      >
        <Container size="wide" className="flex h-16 items-center justify-between lg:h-20">
          {/* Left: mobile toggle + logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden -ml-1 p-1.5 text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link to="/" className="font-display text-2xl font-medium tracking-[0.18em] lg:text-[1.7rem]">
              ANGELORA
            </Link>
          </div>

          {/* Center: nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative text-sm font-medium tracking-wide transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>
            <Link
              to="/cart"
              aria-label="Bag"
              className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && <CountBadge count={cartCount} />}
            </Link>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              aria-label="Account"
              className="hidden sm:grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[6px]" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[82%] max-w-sm bg-background flex flex-col"
            >
              <div className="flex h-16 items-center justify-between px-5 border-b border-border">
                <span className="font-display text-xl font-medium tracking-[0.18em]">ANGELORA</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1.5">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col px-5 py-4">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "block border-b border-border py-4 font-display text-2xl font-medium",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-5">
                <Link to={isAuthenticated ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" strokeWidth={1.5} /> {isAuthenticated ? "Account" : "Sign in"}
                </Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4" strokeWidth={1.5} /> Wishlist
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={(path) => { setSearchOpen(false); navigate(path); }} />
    </>
  );
}