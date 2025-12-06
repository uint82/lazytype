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
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
      }}
      style={{
        width: "3px",
        height: "2.3rem",
        backgroundColor: "var(--main)",
        borderRadius: "1px",
        animation: isTyping ? "none" : "blink 1.1s ease-in-out infinite",
      }}
    />
  );
};

export default Caret;
