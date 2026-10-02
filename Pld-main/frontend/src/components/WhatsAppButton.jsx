import { motion } from "framer-motion";
import { COMPANY } from "../data/projects";

// Floating WhatsApp help button with "I need help?" tooltip
export const WhatsAppButton = () => {
  return (
    <motion.a
      data-testid="whatsapp-float-btn"
      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
        "नमस्कार, मला Pandurang Land Developers च्या प्लॉट्सबद्दल माहिती हवी आहे."
      )}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 group"
      aria-label="WhatsApp"
    >
      <span className="hidden sm:block font-display italic text-sm text-[var(--forest)] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
        I need help?
      </span>
      <span className="relative grid place-items-center h-14 w-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] group-hover:scale-110 transition-transform duration-300">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg viewBox="0 0 32 32" className="h-8 w-8 relative" fill="white">
          <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.56-1.72a12.7 12.7 0 006.24 1.63h.01c7.06 0 12.8-5.74 12.8-12.8s-5.75-12.71-12.81-12.71zm0 23.06h-.01a10.6 10.6 0 01-5.4-1.48l-.39-.23-4.03 1.06 1.08-3.93-.25-.4a10.55 10.55 0 01-1.62-5.62c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.5 1.11 7.51 3.12a10.56 10.56 0 013.11 7.52c0 5.86-4.77 10.62-10.63 10.62zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.62-.52-.54-.71-.55l-.6-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.62s1.13 3.04 1.29 3.25c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>
    </motion.a>
  );
};
