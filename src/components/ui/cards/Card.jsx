import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // Ensure this is imported

const Card = ({ title, children, className, showAllLink }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center">
        {title && <h2 className="font-bold text-lg text-gray-600">{title}</h2>}
        {showAllLink && (
          <Link to={showAllLink.link} className="text-blue-500 hover:underline">
            {showAllLink.text}
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  showAllLink: PropTypes.shape({
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }), // Define the shape of `showAllLink` object
};

export default Card;