import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY } from "../data/projects";

const links = [
  { label: "Home", mr: "मुख्यपृष्ठ", to: "/" },
  { label: "Projects", mr: "प्रकल्प", to: "/projects" },
  { label: "About us", mr: "आमच्याविषयी", to: "/about" },
  { label: "Contact us", mr: "संपर्क", to: "/contact" },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <button
          data-testid="logo-home-link"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-[var(--gold)] text-black font-display text-2xl leading-none shadow-md group-hover:rotate-[-6deg] transition-transform duration-300">
            प
          </span>
          <span className="hidden sm:flex flex-col text-left leading-none">
            <span
              className={`text-[15px] font-bold tracking-tight ${
                scrolled ? "text-[var(--forest)]" : "text-white drop-shadow"
              }`}
            >
              PANDURANG
            </span>
            <span
              className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${
                scrolled ? "text-neutral-500" : "text-white/70"
              }`}
            >
              Land Developers
            </span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => {
            const active =
              l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`nav-underline text-sm font-semibold tracking-wide ${
                  active
                    ? "active text-[var(--gold)]"
                    : scrolled
                      ? "text-neutral-800 hover:text-[var(--gold)]"
                      : "text-white/90 hover:text-[var(--gold)] drop-shadow"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            data-testid="nav-enquire-btn"
            className="btn-gold rounded-full px-5 py-2.5 text-sm font-bold"
          >
            Enquire Now
          </a>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid place-items-center h-11 w-11 rounded-full bg-white/90 border border-black/10 text-[var(--forest)]"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-black/5"
          >
            <div className="px-6 py-4 flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="py-3 flex items-baseline justify-between border-b border-black/5 last:border-0"
                >
                  <span className="text-lg font-semibold text-neutral-900">{l.label}</span>
                  <span className="font-display text-sm text-neutral-500">{l.mr}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
