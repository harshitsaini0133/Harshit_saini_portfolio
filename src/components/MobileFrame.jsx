import { motion } from "framer-motion";

import PropTypes from "prop-types";

export default function MobileFrame({ children }) {
  return (
    <div className="mobile-mockup-wrapper">
      <div className="mobile-mockup">
        {/* Hardware Buttons */}
        <div className="mockup-btn volume-up"></div>
        <div className="mockup-btn volume-down"></div>
        <div className="mockup-btn power"></div>

        <div className="mockup-screen">
          {/* Notch */}
          <div className="mockup-notch">
            <div className="camera-dot"></div>
            <div className="speaker-grill"></div>
          </div>

          {/* Content (Video) */}
          {children}
        </div>
      </div>
    </div>
  );
}

MobileFrame.propTypes = {
  children: PropTypes.node.isRequired,
};
