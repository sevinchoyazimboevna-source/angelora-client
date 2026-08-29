import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";
import Container from "./Container";

const COLS = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/about" },
      { label: "Careers", to: "/about" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Rings", to: "/jewelry?category=rings" },
      { label: "Necklaces", to: "/jewelry?category=necklaces" },
      { label: "Earrings", to: "/jewelry?category=earrings" },
      { label: "Bracelets", to: "/jewelry?category=bracelets" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", to: "/about" },
      { label: "Returns", to: "/about" },
      { label: "FAQ", to: "/about" },
      { label: "Contact", to: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link to="/" className="font-display text-2xl font-medium tracking-[0.18em]">
              ANGELORA
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Fine jewelry, precision-set and made to be remembered. Designed in our atelier, crafted to endure.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-foreground/80 hover:text-accent transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Aetheris. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}