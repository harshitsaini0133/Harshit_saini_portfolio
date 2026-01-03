import { motion } from "framer-motion";

export default function AuroraBackground() {
  const variants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="aurora-container">
      <motion.div
        className="aurora-blob blob-1"
        variants={variants}
        animate="animate"
      />
      <motion.div
        className="aurora-blob blob-2"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="aurora-blob blob-3"
        animate={{
          x: [0, -70, 0],
          y: [0, 100, 0],
          rotate: [0, -60, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
