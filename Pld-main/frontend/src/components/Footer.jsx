import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { COMPANY } from "../data/projects";
import { getProjects } from "../lib/api";

export const Footer = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  return (
    <footer
      data-testid="footer"
      className="relative bg-[var(--forest-deep)] text-neutral-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-[var(--gold)] text-black font-display text-2xl">
                प
              </span>
              <div className="leading-none">
                <p className="text-white text-lg font-bold tracking-tight">PANDURANG</p>
                <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold)] font-semibold">
                  Land Developers
                </p>
              </div>
            </div>
            <p className="font-display text-2xl text-white mt-6 leading-snug max-w-md">
              {COMPANY.tagline}
            </p>
            <p className="mt-4 text-sm text-neutral-400 max-w-md">
              N.A. residential plots across Sangli–Miraj. Clear title, 7/12 & 8-अ transfer, loan
              assistance available.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[var(--gold)]">
              Projects
            </p>
            <ul className="mt-5 space-y-2.5">
              {projects.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/projects/${p.slug}`}
                    data-testid={`footer-project-${p.slug}`}
                    className="font-display text-neutral-300 hover:text-[var(--gold)] transition-colors duration-300"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[var(--gold)]">
              Get in touch
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-[var(--gold)] shrink-0 mt-0.5" />
                <span className="font-display leading-relaxed">{COMPANY.addressMr}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={18} className="text-[var(--gold)] shrink-0" />
                <span>
                  {COMPANY.phones.map((ph, i) => (
                    <a
                      key={ph}
                      href={`tel:${ph}`}
                      data-testid={`footer-phone-${i}`}
                      className="hover:text-[var(--gold)] transition-colors duration-300"
                    >
                      {ph}
                      {i < COMPANY.phones.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Clock size={18} className="text-[var(--gold)] shrink-0" />
                <span className="font-display">{COMPANY.hours}</span>
              </li>
            </ul>
            <Link
              to="/contact"
              data-testid="footer-cta"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 mt-6 text-sm font-bold"
            >
              Get in touch <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Pandurang Land Developers · सांगली</p>
          <p className="tracking-wide">{COMPANY.website}</p>
        </div>
      </div>
    </footer>
  );
};
