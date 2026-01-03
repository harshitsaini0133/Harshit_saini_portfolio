import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Initializing Secure Environment...",
  "Loading 3D Assets...",
  "Compiling Shaders...",
  "Verifying Identity...",
  "Access Granted.",
];

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Text cycle
    const textInterval = setInterval(() => {
      setIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Random increments for "realistic" loading feel
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    // Exit trigger
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="loader-content">
        <div className="loader-text hacker-text">{words[index]}</div>

        <div className="progress-container">
          <motion.div
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="counter">{Math.min(progress, 100)}%</div>
      </div>

      {/* Decorative scanline */}
      <div className="scanline"></div>
    </motion.div>
  );
}

Preloader.propTypes = {
  onComplete: PropTypes.func.isRequired,
};
