import { useState, lazy, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// Core Layout Components (Eager Load for LCP)
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import AuroraBackground from "./components/AuroraBackground";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";

// Lazy Load Heavy Components to optimize Bundle Size
const Background = lazy(() => import("./components/Background")); // Three.js Bundle
const Projects = lazy(() => import("./components/Projects")); // Images/Videos
const MobileFrame = lazy(() => import("./components/MobileFrame")); // Heavy SVG/Markup

function App() {
  const [loading, setLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);

  // Memoize handlers to prevent unnecessary re-renders of child components
  const openVideo = useCallback((src) => setVideoSrc(src), []);
  const closeVideo = useCallback(() => setVideoSrc(null), []);
  const handleLoadComplete = useCallback(() => setLoading(false), []);

  return (
    <div className="app-container">
      {/* PRELOADER */}
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* BACKGROUND LAYERS */}
      {!loading && (
        <>
          <div className="noise-overlay" />
          <CustomCursor />
          <AuroraBackground />
          <Suspense fallback={null}>
            <Background />
          </Suspense>
        </>
      )}

      {/* MAIN CONTENT */}
      {!loading && (
        <main className="main-layout">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>

          <div className="content-wrapper glass-panel">
            <Hero />

            <Suspense
              fallback={
                <div className="loading-placeholder">Loading Projects...</div>
              }
            >
              <Projects onOpenVideo={openVideo} />
            </Suspense>

            <AchievementsSection />

            <footer className="footer">
              <p>Made with 💙 by Harshit Saini · Flutter Developer</p>
            </footer>
          </div>
        </main>
      )}

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {videoSrc && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <motion.div
              className="modal-content with-frame"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn-frame"
                onClick={closeVideo}
                aria-label="Close Modal"
              >
                <FaTimes />
              </button>
              <Suspense
                fallback={
                  <div className="loading-spinner">Loading Frame...</div>
                }
              >
                <MobileFrame>
                  <video
                    src={videoSrc}
                    controls={false}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </MobileFrame>
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extracted for readability & cleaner App component
function AchievementsSection() {
  return (
    <section className="section achievements">
      <h2 className="section-title">Achievements</h2>
      <div className="achievement-card premium-border">
        <span className="icon">🏆</span>
        <span>Secured 2nd place in Robotic Car Race Tournament (2021)</span>
      </div>
      <div style={{ height: "10px" }}></div>
      <div className="achievement-card premium-border">
        <span className="icon">🥇</span>
        <span>
          Represented district in State-Level Kabaddi Tournaments (2019)
        </span>
      </div>
    </section>
  );
}

export default App;
