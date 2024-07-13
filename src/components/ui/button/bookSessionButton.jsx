import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoModal from '../modal/UserInfoModal';
import PropTypes from 'prop-types';

const BookSessionButton = ({ className }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user information is stored in local storage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleBookSessionClick = () => {
    if (isLoggedIn) {
      navigate ('/main/dashboard'); // Navigate to the dashboard
    } else {
     navigate ('/signup');
    }
  };

 

  return (
    <>
      <button
        onClick={handleBookSessionClick}
        className={`${className}`}
      >
        Book a Session
      </button>
      <UserInfoModal />
    </>
  );
};

BookSessionButton.propTypes = {
    className: PropTypes.string
    };

export default BookSessionButton;
