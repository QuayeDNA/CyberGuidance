import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Button component
function Button({ Icon, title, description, to }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return (
        <button onClick={handleClick} className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-center space-x-4 transition duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-300">
            <Icon className="text-4xl text-blue-500" />
            <div>
                <div className='text-left'>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-gray-700 hidden md:block">{description}</p>
                </div>
            </div>
        </button>
    );
}

Button.propTypes = {
    Icon: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default Button;
