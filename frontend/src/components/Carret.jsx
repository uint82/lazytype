import { motion } from "framer-motion";

const Caret = ({ x, y, isTyping }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        left: x - 1,
        top: y + 5,
      }}
      animate={{
        left: x - 1,
        top: y + 5,
      }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 30,
        mass: 0.4,
      }}
      style={{
        width: "3px",
        height: "2.3rem",
        backgroundColor: "var(--text-cursor)",
        borderRadius: "1px",
        animation: isTyping ? "none" : "blink 1.1s ease-in-out infinite",
      }}
    />
  );
};

export default Caret;
