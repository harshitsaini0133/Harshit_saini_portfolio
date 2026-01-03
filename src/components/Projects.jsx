import { useState, memo } from "react";
import PropTypes from "prop-types";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { projectsData } from "../data/content";

// Memoize individual Project Card to prevent re-renders when other cards interacting
const ProjectCard = memo(({ project, onOpenVideo, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      transitionSpeed={2500}
      className="project-card glass-panel"
    >
      <motion.div
        // Animation config
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div className="card-content">
          <div className="card-header">
            <h3>{project.title}</h3>
            <span className="meta">{project.meta}</span>
          </div>
          <p>{project.description}</p>
          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="card-actions">
          <button
            className="neon-button"
            onClick={() => onOpenVideo(project.video)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Watch demo for ${project.title}`}
          >
            <span className="icon-container">
              {isHovered ? (
                <FaPlay className="icon-play" />
              ) : (
                <FaPlay className="icon-play-static" />
              )}
            </span>
            <span className="btn-text">Watch Demo</span>
            <div className="btn-bg"></div>
          </button>
        </div>
      </motion.div>
    </Tilt>
  );
});

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    meta: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    video: PropTypes.string.isRequired,
  }).isRequired,
  onOpenVideo: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

ProjectCard.displayName = "ProjectCard";

function Projects({ onOpenVideo }) {
  // Data is now imported from ../data/content.js for better separation of concerns

  return (
    <section className="projects-section section">
      <h2 className="section-title">Featured Projects</h2>
      <div className="projects-grid">
        {projectsData.map((p, i) => (
          <ProjectCard
            key={i}
            project={p}
            index={i}
            onOpenVideo={onOpenVideo}
          />
        ))}
      </div>
    </section>
  );
}

Projects.propTypes = {
  onOpenVideo: PropTypes.func.isRequired,
};

// Wrap export in memo to avoid re-renders of the entire list if props don't change
export default memo(Projects);
