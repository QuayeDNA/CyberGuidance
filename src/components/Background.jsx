import "./css/Background.css";
import PropTypes from "prop-types";

const BeautifulBackground = ({ children }) => {
  return (
    <div className="relative max-w-full overflow-hidden rounded-lg mx-auto p-4 bg-white shadow-lg bg-pattern min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

BeautifulBackground.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BeautifulBackground;
