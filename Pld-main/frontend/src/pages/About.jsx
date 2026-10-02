import { Link } from "react-router-dom";
import { ArrowUpRight, Target, Heart, TrendingUp } from "lucide-react";
import { RevealText, FadeIn } from "../components/Reveal";
import { Marquee } from "../components/Marquee";
import { IMAGES, COMPANY } from "../data/projects";

const values = [
  {
    icon: Target,
    title: "आमचे ध्येय",
    en: "Our Mission",
    text: "किफायतशीर दरात सर्व सोयी-सुविधांयुक्त, कायदेशीर व वास्तुशास्त्रानुसार प्लॉट्स उपलब्ध करून देणे.",
  },
  {
    icon: Heart,
    title: "आमची मूल्ये",
    en: "Our Values",
    text: "पारदर्शकता, विश्वास आणि ग्राहक समाधान हेच आमच्या प्रत्येक व्यवहाराचे केंद्रबिंदू आहेत.",
  },
  {
    icon: TrendingUp,
    title: "आमचे वचन",
    en: "Our Promise",
    text: "प्रत्येक प्लॉटसाठी ७/१२ व ८-अ उतारा, स्पष्ट टायटल आणि कर्ज सहाय्याची हमी.",
  },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="relative pt-[72px]">
        <div className="relative h-[46vh] min-h-[360px] overflow-hidden">
          <img src={IMAGES.parkLandscape} alt="About us" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/70" />
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <p className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-bold mb-4">
              About us
            </p>
            <RevealText
              as="h1"
              className="font-display text-white text-4xl sm:text-6xl leading-none"
              lines={["आमच्याविषयी"]}
            />
          </div>
        </div>
      </section>

      <Marquee />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl aspect-[4/5]">
              <img src={IMAGES.familyPark} alt="Community" className="h-full w-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--clay)]">
              {COMPANY.name}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mt-4 text-neutral-900">
              विश्वासाने घडवलेली स्वप्नांची घरे.
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mt-6 font-body">
              {COMPANY.nameMr} ही सांगली-मिरज परिसरातील एक अग्रगण्य लॅन्ड डेव्हलपमेंट कंपनी आहे.
              गेल्या अनेक वर्षांपासून आम्ही ग्राहकांना N.A. मंजूर, पूर्ण विकसित व वास्तुशास्त्रानुसार
              नियोजित प्लॉट्स देत आलो आहोत.
            </p>
            <p className="text-neutral-600 text-lg leading-relaxed mt-4 font-body">
              भव्य स्वागत कमान, प्रशस्त डांबरी रस्ते, पाणी, वीज व स्ट्रीट लाईट्स अशा सर्व सुविधांसह
              आमचे प्रकल्प तुमच्या कुटुंबासाठी एक सुरक्षित व समृद्ध भविष्य घडवतात.
            </p>
            <Link
              to="/projects"
              data-testid="about-projects-btn"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 mt-8 font-bold text-sm"
            >
              आमचे प्रकल्प पाहा <ArrowUpRight size={16} />
            </Link>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {values.map((v, i) => (
            <FadeIn key={v.en} delay={i * 0.08}>
              <div className="h-full rounded-2xl bg-white border border-black/5 p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-[var(--forest)] text-white">
                  <v.icon size={22} />
                </span>
                <p className="text-xs tracking-[0.2em] uppercase font-bold text-neutral-400 mt-6">
                  {v.en}
                </p>
                <h3 className="font-display text-2xl mt-1 text-neutral-900">{v.title}</h3>
                <p className="text-neutral-600 mt-3 font-body leading-relaxed">{v.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
