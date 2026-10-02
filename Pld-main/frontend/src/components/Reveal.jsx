import { motion } from "framer-motion";

// Line-by-line masked reveal. Pass `lines` array of strings.
export const RevealText = ({ lines = [], className = "", delay = 0, as = "h1" }) => {
  const Tag = motion[as] || motion.h1;
  return (
    <Tag className={className} data-testid="reveal-text">
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <motion.span
            style={{ display: "block" }}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.12,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export const FadeIn = ({ children, delay = 0, y = 28, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    {...rest}
  >
    {children}
  </motion.div>
);
