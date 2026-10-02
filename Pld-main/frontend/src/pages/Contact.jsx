import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RevealText, FadeIn } from "../components/Reveal";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { submitEnquiry, getProjects } from "../lib/api";
import { COMPANY } from "../data/projects";

const empty = { name: "", phone: "", email: "", project: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("कृपया नाव व मोबाईल नंबर भरा.");
      return;
    }
    setLoading(true);
    try {
      await submitEnquiry(form);
      toast.success("धन्यवाद! तुमची चौकशी नोंदवली गेली आहे. आम्ही लवकरच संपर्क करू.");
      setDone(true);
      setForm(empty);
    } catch (err) {
      toast.error("काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा किंवा कॉल करा.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="relative pt-[72px]">
        <div className="relative h-[40vh] min-h-[320px] overflow-hidden bg-[var(--forest)]">
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <p className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-bold mb-4">
              Contact us
            </p>
            <RevealText
              as="h1"
              className="font-display text-white text-4xl sm:text-6xl leading-none"
              lines={["चला, बोलूया."]}
            />
            <p className="text-white/80 mt-4 max-w-xl font-body">
              साईट व्हिजिट, किंमती किंवा कर्ज सहाय्याबद्दल विचारायचंय? फॉर्म भरा किंवा थेट कॉल करा.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14">
          {/* info */}
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-900">
              पांडुरंग लॅन्ड डेव्हलपर्स
            </h2>
            <div className="mt-8 space-y-6">
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                data-testid="contact-address"
                className="flex gap-4 group"
              >
                <span className="grid place-items-center h-11 w-11 rounded-full bg-[var(--clay)] text-white shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">
                    पत्ता · Office
                  </p>
                  <p className="font-display text-lg text-neutral-800 mt-1 group-hover:text-[var(--clay)] transition-colors duration-300 leading-relaxed">
                    {COMPANY.addressMr}
                  </p>
                </div>
              </a>

              <div className="flex gap-4">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-[var(--forest)] text-white shrink-0">
                  <Phone size={20} />
                </span>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">
                    Contact
                  </p>
                  <p className="mt-1 flex flex-col">
                    {COMPANY.phones.map((ph, i) => (
                      <a
                        key={ph}
                        href={`tel:${ph}`}
                        data-testid={`contact-phone-${i}`}
                        className="font-display text-xl text-neutral-800 hover:text-[var(--forest)] transition-colors duration-300"
                      >
                        {ph}
                      </a>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-neutral-900 text-white shrink-0">
                  <Clock size={20} />
                </span>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">
                    ऑफिस वेळ
                  </p>
                  <p className="font-display text-lg text-neutral-800 mt-1">{COMPANY.hours}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-black/5 aspect-[16/10]">
              <iframe
                title="Office location"
                data-testid="contact-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          {/* form */}
          <FadeIn delay={0.1}>
            <div className="rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14"
                  data-testid="enquiry-success"
                >
                  <CheckCircle2 size={56} className="text-green-600 mx-auto" />
                  <h3 className="font-display text-3xl mt-5 text-neutral-900">धन्यवाद!</h3>
                  <p className="text-neutral-600 mt-3 font-body">
                    तुमची चौकशी नोंदवली गेली आहे. आमची टीम लवकरच तुमच्याशी संपर्क करेल.
                  </p>
                  <button
                    data-testid="enquiry-reset-btn"
                    onClick={() => setDone(false)}
                    className="btn-gold rounded-full px-6 py-3 mt-7 font-bold text-sm"
                  >
                    नवीन चौकशी करा
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} data-testid="enquiry-form" className="space-y-5">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-neutral-900">
                      Get in touch
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1 font-body">
                      सर्व * फील्ड आवश्यक आहेत.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">नाव / Name *</Label>
                      <Input
                        id="name"
                        data-testid="enquiry-name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="तुमचे नाव"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">मोबाईल / Phone *</Label>
                      <Input
                        id="phone"
                        data-testid="enquiry-phone"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="10 अंकी नंबर"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">ईमेल / Email</Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="enquiry-email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Interested Project</Label>
                    <Select value={form.project} onValueChange={(v) => update("project", v)}>
                      <SelectTrigger data-testid="enquiry-project" className="h-11">
                        <SelectValue placeholder="प्रकल्प निवडा" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem
                            key={p.slug}
                            value={p.name}
                            data-testid={`enquiry-project-option-${p.slug}`}
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="इतर / Other">इतर / Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">संदेश / Message</Label>
                    <Textarea
                      id="message"
                      data-testid="enquiry-message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="तुमचा प्रश्न किंवा गरज लिहा..."
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    data-testid="enquiry-submit-btn"
                    disabled={loading}
                    className="btn-gold w-full rounded-full py-4 font-bold inline-flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> पाठवत आहे...
                      </>
                    ) : (
                      <>
                        चौकशी पाठवा <Send size={17} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
