import { motion } from "framer-motion";

const Caret = ({ x, y, isTyping }) => {
  return (
    <motion.div
      className="caret absolute"
      initial={{
        left: x + 8,
        top: y + 8,
      }}
      animate={{
        left: x - 2,
        top: y + 5,
      }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 30,
        mass: 0.4,
      }}
      style={{
        animation: isTyping ? "none" : "blink 1.1s ease-in-out infinite",
      }}
    />
  );
};

export default Caret;
