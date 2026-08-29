import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useAppSelector } from "@/store/hooks";
import { selectFullName } from "@/store/profile";
import { selectWishlistCount } from "@/store/wishlist";
import { selectOrders } from "@/store/orders";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/account", label: "Profile", icon: User, end: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = useAppSelector(selectFullName);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const orders = useAppSelector(selectOrders);
  const email = user?.email || "*";

  const handleLogout = () => logout(false) || navigate("/");

  return (
    <Container size="wide" className="py-12 lg:py-16">
      <div className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Account</div>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">{user.memberNick}</h1>
        <p className="mt-2 text-muted-foreground">{email}</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1 no-scrollbar">
            {NAV.map((n) => {
              const badge = n.to === "/wishlist" ? wishlistCount : n.to === "/account/orders" ? orders.length : null;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm whitespace-nowrap transition-colors",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )
                  }
                >
                  <n.icon className="h-4 w-4" strokeWidth={1.5} />
                  {n.label}
                  {badge > 0 && <span className="ml-auto hidden lg:inline text-xs text-muted-foreground">{badge}</span>}
                </NavLink>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
            </button>
          </nav>
        </aside>

        <div className="min-h-[40vh]">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}