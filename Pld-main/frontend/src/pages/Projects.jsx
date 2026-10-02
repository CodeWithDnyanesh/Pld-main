import { useState, useEffect } from "react";
import { RevealText } from "../components/Reveal";
import { Marquee } from "../components/Marquee";
import { ProjectCard } from "../components/ProjectCard";
import { IMAGES } from "../data/projects";
import { getProjects } from "../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);
  return (
    <div data-testid="projects-page">
      {/* header */}
      <section className="relative pt-[72px]">
        <div className="relative h-[46vh] min-h-[360px] overflow-hidden">
          <img
            src={IMAGES.gatedEntrance}
            alt="Land development projects"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/70" />
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <p className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-bold mb-4">
              Home → Projects → Land Development
            </p>
            <RevealText
              as="h1"
              className="font-display text-white text-4xl sm:text-6xl leading-none"
              lines={["आमचे प्रकल्प"]}
            />
            <p className="text-white/80 mt-4 max-w-xl font-body">
              सांगली-मिरज परिसरातील १० प्रीमियम N.A. टाउनशिप प्रकल्प. Explore all ten developments
              below.
            </p>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
