import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight, ShieldCheck, Landmark, Ruler, Trees } from "lucide-react";
import { RevealText, FadeIn } from "../components/Reveal";
import { Marquee } from "../components/Marquee";
import { ProjectCard } from "../components/ProjectCard";
import { IMAGES, COMPANY } from "../data/projects";
import { getProjects } from "../lib/api";

const chapters = [
  {
    no: "01",
    icon: ShieldCheck,
    title: "Clear Title, Total Trust",
    mr: "खरेदीपत्रा नंतर ७/१२ व ८-अ उतारा करून देणेची हमी. संपूर्ण कायदेशीर व पारदर्शक व्यवहार.",
  },
  {
    no: "02",
    icon: Ruler,
    title: "Vastu-Planned Plots",
    mr: "सर्व प्लॉट वास्तुशास्त्रानुसार पूर्व, पश्चिम व उत्तर मुखी. बांधकामास योग्य N.A. जमीन.",
  },
  {
    no: "03",
    icon: Landmark,
    title: "Loan Assistance",
    mr: "प्लॉट घेणेस कर्ज उपलब्ध. तुमच्या स्वप्नातील घरासाठी सोपी आर्थिक मदत.",
  },
  {
    no: "04",
    icon: Trees,
    title: "Green, Serene Living",
    mr: "प्रशस्त डांबरी रस्ते, स्ट्रीट लाईट्स, चिल्ड्रन पार्क व शांत, प्रदूषण विरहित परिसर.",
  },
];

const stats = [
  { value: "10+", label: "Township Projects" },
  { value: "₹199", label: "Starting / sq.ft*" },
  { value: "100%", label: "N.A. Sanctioned" },
  { value: "7/12", label: "Title Transfer" },
];

export default function Home() {
  const heroRef = useRef(null);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <img
            src={IMAGES.heroAerial}
            alt="Aerial view of township plots"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </motion.div>

        <motion.div
          style={{ y: overlayY }}
          className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[var(--gold)] text-xs sm:text-sm tracking-[0.32em] uppercase font-bold mb-5"
          >
            Sangli · Miraj · Maharashtra
          </motion.p>

          <RevealText
            as="h1"
            className="font-display text-white text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl text-balance"
            lines={["तुमच्या स्वप्नांचे", "हक्काचे ठिकाण."]}
            delay={0.35}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 text-white/85 text-base sm:text-lg max-w-xl font-body leading-relaxed"
          >
            फक्त इथेच मिळेल तुम्हाला <span className="text-[var(--gold)] font-semibold">'कमीत कमी'</span>{" "}
            किंमतीमध्ये जास्तीत जास्त सोयी-सुविधा — premium N.A. residential plots.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/projects"
              data-testid="hero-view-projects-btn"
              className="btn-gold rounded-full px-7 py-3.5 text-sm font-bold inline-flex items-center gap-2"
            >
              View Projects <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/contact"
              data-testid="hero-contact-btn"
              className="rounded-full px-7 py-3.5 text-sm font-bold text-white border border-white/40 hover:bg-white/10 backdrop-blur-sm transition-colors duration-300 inline-flex items-center gap-2"
            >
              Get in touch <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-6 hidden lg:flex items-center gap-2 text-white/60 text-xs tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180"
        >
          Scroll to explore
        </motion.div>
      </section>

      <Marquee />

      {/* INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-end">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--clay)]">
              Who we are
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mt-4 text-neutral-900">
              सांगली-मिरजमधील विश्वासार्ह लॅन्ड डेव्हलपर.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-neutral-600 text-lg leading-relaxed font-body">
              {COMPANY.nameMr} तुम्हाला देतो पूर्णपणे विकसित, N.A. मंजूर व वास्तुशास्त्रानुसार
              नियोजित प्लॉट्स — भव्य स्वागत कमान, प्रशस्त रस्ते आणि सर्व मूलभूत सुविधांसह. Every plot
              comes with a clear title, 7/12 & 8-अ transfer and loan assistance.
            </p>
            <Link
              to="/about"
              data-testid="intro-about-link"
              className="inline-flex items-center gap-2 mt-6 font-bold text-[var(--forest)] nav-underline"
            >
              More about us <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className="rounded-2xl bg-white border border-black/5 p-7 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
                <p className="font-display text-4xl sm:text-5xl text-[var(--forest)]">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-2 font-body">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* MANIFESTO CHAPTERS */}
      <section className="bg-[var(--forest)] text-[var(--sand)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--gold)]">
              Why choose us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 max-w-2xl leading-tight">
              चार गोष्टी ज्या आम्हाला वेगळं ठरवतात.
            </h2>
          </FadeIn>

          <div className="mt-16 divide-y divide-white/10 border-t border-white/10">
            {chapters.map((c, i) => (
              <FadeIn key={c.no} delay={i * 0.06}>
                <div className="group grid md:grid-cols-[100px_60px_1fr] gap-4 md:gap-8 items-start py-8 hover:bg-white/[0.03] transition-colors duration-300 px-2 -mx-2 rounded-xl">
                  <span className="font-display text-4xl text-[var(--gold)]/70 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {c.no}
                  </span>
                  <c.icon className="text-[var(--gold)] mt-1" size={30} />
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white">{c.title}</h3>
                    <p className="font-display text-lg text-neutral-300 mt-2 leading-relaxed max-w-2xl">
                      {c.mr}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--clay)]">
              Our townships
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 text-neutral-900">
              निवडक प्रकल्प.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              to="/projects"
              data-testid="featured-all-projects-btn"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 font-bold text-sm hover:bg-neutral-900 hover:text-white transition-colors duration-300"
            >
              All 10 projects <ArrowUpRight size={16} />
            </Link>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-[var(--forest-deep)] px-8 sm:px-14 py-16 sm:py-20">
            <img
              src={IMAGES.greenLayout}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-tight">
                'पुर्ण होतील तुमची स्वप्ने व इच्छा आकांक्षा'
              </h2>
              <p className="text-neutral-300 mt-5 text-lg font-body">
                आजच साईट व्हिजिट बुक करा किंवा आमच्याशी संपर्क साधा.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  data-testid="cta-book-visit-btn"
                  className="btn-gold rounded-full px-7 py-3.5 text-sm font-bold inline-flex items-center gap-2"
                >
                  Book a site visit <ArrowUpRight size={18} />
                </Link>
                <a
                  href={`tel:${COMPANY.phones[0]}`}
                  data-testid="cta-call-btn"
                  className="rounded-full px-7 py-3.5 text-sm font-bold text-white border border-white/30 hover:bg-white/10 transition-colors duration-300"
                >
                  Call {COMPANY.phones[0]}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
