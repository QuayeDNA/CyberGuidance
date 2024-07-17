import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust the path as necessary
import PropTypes from 'prop-types';

function BookSessionButton({ className }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Use the auth status from the context

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/student/dashboard');
    } else {
      navigate('/student/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className}`}
    >
      Book a Session
    </button>
  );
}

BookSessionButton.propTypes = {
  className: PropTypes.string,
};
export default BookSessionButton;
