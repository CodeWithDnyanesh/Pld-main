const items = [
  "प्रशस्त डांबरी रस्ते",
  "N.A. Sanctioned Plots",
  "प्लॉट घेणेस कर्ज उपलब्ध",
  "7/12 · 8-अ Transfer",
  "वास्तुशास्त्रानुसार प्लॉट्स",
  "Clear Title Guarantee",
  "शांत व प्रदूषण विरहित परिसर",
  "Loan Assistance",
];

export const Marquee = () => {
  const loop = [...items, ...items];
  return (
    <section
      data-testid="marquee"
      className="bg-[var(--forest)] text-[var(--sand)] py-5 border-y border-white/10 overflow-hidden select-none"
    >
      <div className="marquee-track items-center">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display text-xl sm:text-2xl px-8">{t}</span>
            <span className="text-[var(--gold)] text-lg">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
};
