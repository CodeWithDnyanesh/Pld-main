import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  MapPin,
  Download,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Landmark,
  Loader2,
} from "lucide-react";
import { RevealText, FadeIn } from "../components/Reveal";
import { COMPANY } from "../data/projects";
import { getProject, getProjects, brochureUrl } from "../lib/api";

const Badge = ({ children, className, testid }) => (
  <span
    data-testid={testid}
    className={`inline-flex items-center gap-1.5 rounded-full text-xs font-bold px-3.5 py-1.5 ${className}`}
  >
    {children}
  </span>
);

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getProject(slug), getProjects()])
      .then(([p, all]) => {
        if (!active) return;
        setProject(p);
        setOthers(all.filter((x) => x.slug !== slug).slice(0, 3));
      })
      .catch(() => active && setProject(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" data-testid="project-loading">
        <Loader2 className="animate-spin text-[var(--forest)]" size={36} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-[140px] pb-40 text-center" data-testid="project-not-found">
        <p className="font-display text-3xl">प्रकल्प सापडला नाही</p>
        <Link to="/projects" className="btn-gold inline-block rounded-full px-6 py-3 mt-6 font-bold">
          सर्व प्रकल्प पाहा
        </Link>
      </div>
    );
  }

  const downloadBrochure = () => {
    if (project.brochure_path) {
      window.open(brochureUrl(project.slug), "_blank");
      return;
    }
    const text = `PANDURANG LAND DEVELOPERS\n${project.name} (${project.nameEn})\n\nStarting Price: Rs. ${project.price}/- per sq.ft*\nType: N.A. Residential Plots | Loan Available\n\nSite Address:\n${project.address}\n\nFeatures:\n${project.features.map((f) => "- " + f).join("\n")}\n\nContact: ${COMPANY.phones.join(", ")}\n${COMPANY.website}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.nameEn || project.slug).replace(/\s+/g, "-")}-brochure.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="project-detail-page" className="pt-[72px]">
      {/* hero banner */}
      <section className="relative h-[52vh] min-h-[420px] overflow-hidden">
        <img src={project.image} alt={project.nameEn} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/75" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
          <button
            data-testid="back-to-projects"
            onClick={() => navigate("/projects")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-5 w-fit transition-colors duration-300"
          >
            <ArrowLeft size={16} /> All projects
          </button>
          <RevealText
            as="h1"
            className="font-display text-white text-4xl sm:text-6xl leading-none"
            lines={[project.name]}
          />
          <p className="text-white/85 mt-3 font-body max-w-xl">{project.tagline}</p>
        </div>
      </section>

      {/* split panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-start">
          {/* sticky left */}
          <div className="lg:sticky lg:top-24 space-y-5">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={(project.gallery && project.gallery[0]) || project.image}
                alt={project.nameEn}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              {(project.gallery || []).slice(1, 3).map((g, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl aspect-square">
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            {/* price + badges card */}
            <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">
                Starting from
              </p>
              <p className="font-display text-4xl sm:text-5xl text-[var(--clay)] mt-1">
                फक्त ₹{project.price}/-{" "}
                <span className="text-lg text-neutral-500">sq.ft पासून चालू*</span>
              </p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                <Badge testid="badge-na" className="bg-green-600 text-white">
                  <BadgeCheck size={14} /> N.A PLOT
                </Badge>
                <Badge testid="badge-loan" className="bg-blue-600 text-white">
                  <Landmark size={14} /> प्लॉट घेणेस कर्ज उपलब्ध
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  to="/contact"
                  data-testid="detail-enquire-btn"
                  className="btn-gold flex-1 rounded-full px-5 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"
                >
                  Enquire now <ArrowUpRight size={16} />
                </Link>
                <button
                  data-testid="download-brochure-btn"
                  onClick={downloadBrochure}
                  className="flex-1 rounded-full px-5 py-3 text-sm font-bold text-white bg-neutral-900 hover:bg-black transition-colors duration-300 inline-flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Brochure
                </button>
              </div>
            </div>
          </div>

          {/* right content */}
          <div>
            <FadeIn>
              <p className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--clay)]">
                वैशिष्ट्ये · Features
              </p>
              <h2 className="font-display text-3xl sm:text-4xl mt-3 text-neutral-900">
                या प्रकल्पात तुम्हाला काय मिळेल?
              </h2>
            </FadeIn>

            <ul className="mt-8 space-y-4">
              {project.features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                  className="flex gap-3.5 items-start"
                  data-testid={`feature-${i}`}
                >
                  <span className="grid place-items-center h-6 w-6 rounded-full bg-[var(--forest)] text-white shrink-0 mt-0.5">
                    <Check size={14} />
                  </span>
                  <span className="font-display text-lg text-neutral-700 leading-relaxed">{f}</span>
                </motion.li>
              ))}
            </ul>

            {/* address */}
            <FadeIn>
              <div className="mt-10 rounded-2xl bg-[var(--sand)] p-6 flex gap-4">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-[var(--clay)] text-white shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-[var(--clay)]">
                    साईट पत्ता · Site Address
                  </p>
                  <p className="font-display text-lg text-neutral-800 mt-1.5 leading-relaxed">
                    {project.address}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* map */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-black/5 aspect-[16/9]">
              <iframe
                title={`${project.nameEn} map`}
                data-testid="project-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* other projects */}
      <section className="bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-display text-3xl sm:text-4xl mb-10 text-neutral-900">इतर प्रकल्प</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((p, i) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                data-testid={`other-project-${p.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[16/10] block"
              >
                <img
                  src={p.image}
                  alt={p.nameEn}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display text-2xl text-white">{p.name}</h3>
                  <p className="text-[var(--gold)] text-sm font-bold">₹{p.price}/- sq.ft*</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
