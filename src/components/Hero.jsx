import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function Hero() {
  /* HACKER DECODE EFFECT FOR NAME */
  const [nameText, setNameText] = useState("Harshit");

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setNameText((prev) =>
        prev
          .split("")
          .map((letter, index) => {
            if (index < iterations) return "Harshit"[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iterations >= 7) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  /* Typewriter Effect for roles */
  const [text, setText] = useState("");
  const phrases = [
    "Secure-by-design Apps",
    "High-performance UI",
    "Animations that Delight",
    "Flutter + Cybersecurity",
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(100);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta]);

  const tick = () => {
    let i = phraseIndex % phrases.length;
    let fullText = phrases[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prev) => prev / 2);
    } // ... rest of logic

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(2000);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => prev + 1);
      setDelta(100);
    }
  };

  return (
    <motion.section
      className="hero section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="hero-content">
        <h1>
          Hi — I’m <span className="gradient-text hacker-text">{nameText}</span>
        </h1>
        <div className="typewriter-container">
          <span className="typewriter-text">{text}</span>
          <span className="cursor">|</span>
        </div>
        <p className="lead">
          Freelance <strong>Flutter Developer</strong> &{" "}
          <strong>Mobile Security Specialist</strong> helping brands build
          scalable, secure, and{" "}
          <span style={{ color: "var(--primary)" }}>
            high-performance iOS & Android apps
          </span>
          . Expert in <strong>Clean Architecture</strong>, SOLID principles, and
          immersive animations.
        </p>
        <div className="availability">
          <span className="pulse-dot"></span> Open to roles: Senior Flutter
          Developer · Mobile Architect
        </div>
      </div>
    </motion.section>
  );
}
