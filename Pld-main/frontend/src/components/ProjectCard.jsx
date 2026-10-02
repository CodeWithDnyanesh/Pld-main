import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

export const ProjectCard = ({ project, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
    >
      <Link
        to={`/projects/${project.slug}`}
        data-testid={`project-card-${project.slug}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-2xl bg-neutral-200 aspect-[4/5]">
          <img
            src={project.image}
            alt={project.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-[var(--gold)] text-black text-[11px] font-bold px-3 py-1 tracking-wide">
              ₹{project.price}/- sq.ft*
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] font-bold mb-1">
              N.A. Plots
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1.5">
              <MapPin size={13} className="text-[var(--gold)]" />
              <span className="font-body">{project.location}</span>
            </div>

            <div className="mt-3 overflow-hidden">
              <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[transform,opacity] duration-500">
                View project <ArrowUpRight size={16} className="text-[var(--gold)]" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
