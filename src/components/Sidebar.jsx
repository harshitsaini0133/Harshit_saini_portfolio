import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaShieldAlt,
  FaGoogle,
  FaJsSquare,
  FaLayerGroup,
  FaCodeBranch,
  FaDatabase,
  FaTools,
  FaFilePdf,
} from "react-icons/fa";

// ... imports
import Magnetic from "./Magnetic"; // Import Magnetic component

export default function Sidebar() {
  const containerVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.5 + i * 0.1, type: "spring" },
    }),
  };

  return (
    <motion.aside
      className="sidebar glass-panel"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="profile-section">
        <div className="avatar-container">
          {/* Glitch effect on avatar hover could be added here later */}
          <img
            src={`${
              import.meta.env.BASE_URL
            }assets/21EPCCC021_3_F_Harshitsaini.jpg`}
            alt="Harshit Saini - Flutter Developer & Security Expert"
            className="avatar"
          />
          <div className="status-indicator"></div>
        </div>

        <div className="profile-info">
          <h2 className="name">Harshit Saini</h2>
          <div className="role">Senior Flutter Developer</div>
          <div className="sub-role">
            Cybersecurity Engineer &bull; Mobile Architect
          </div>
          <div className="location">Jaipur, India</div>
        </div>
      </div>

      <div className="contact-list">
        <div className="contact-item">
          <span className="label">Email</span>
          <a href="mailto:harshitsaini0133@gmail.com" className="value">
            harshitsaini0133@gmail.com
          </a>
        </div>
        <div className="contact-item">
          <span className="label">Phone</span>
          <a href="tel:+916350481444" className="value">
            +91 63504 81444
          </a>
        </div>
      </div>

      <div className="socials">
        <Magnetic>
          <a
            href="https://github.com/harshitsaini0133"
            className="social-pill"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub /> <span>GitHub</span>
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://tryhackme.com/p/harshitsaini0133"
            className="social-pill"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaShieldAlt /> <span>TryHackMe</span>
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://www.linkedin.com/in/harshit-saini-8035cy"
            className="social-pill"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin /> <span>LinkedIn</span>
          </a>
        </Magnetic>
      </div>

      <div className="divider"></div>

      <div className="skills-section">
        <div className="section-title">Core Skills</div>
        <div className="skill-grid">
          <Magnetic>
            <div className="skill-tag">
              <FaGoogle /> Flutter
            </div>
          </Magnetic>
          <Magnetic>
            <div className="skill-tag">
              <FaJsSquare /> Dart
            </div>
          </Magnetic>
          <Magnetic>
            <div className="skill-tag">
              <FaLayerGroup /> Riverpod
            </div>
          </Magnetic>
          <Magnetic>
            <div className="skill-tag">
              <FaCodeBranch /> CI/CD
            </div>
          </Magnetic>
          <Magnetic>
            <div className="skill-tag">
              <FaDatabase /> Firebase
            </div>
          </Magnetic>
          <Magnetic>
            <div className="skill-tag">
              <FaTools /> Clean Arch
            </div>
          </Magnetic>
        </div>
      </div>

      <div className="divider"></div>

      <div className="stats-section">
        {[
          { num: "5+", label: "Apps" },
          { num: "30%", label: "Faster" },
          { num: "95%", label: "Crash-Free" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card"
            custom={i}
            variants={statVariants}
          >
            <div className="stat-num gradient-text">{stat.num}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <a
        href={`${import.meta.env.BASE_URL}assets/HarshitSaini.pdf`}
        className="download-btn neon-border"
        target="_blank"
      >
        <FaFilePdf /> View Resume
      </a>
    </motion.aside>
  );
}
