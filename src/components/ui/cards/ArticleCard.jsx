import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ title, imageUrl, link }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <div className='mt-4' onClick={handleClick}>
            {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <p className="font-bold text-lg mb-2">{title}</p>
            <p className="text-blue-500 hover:underline cursor-pointer">Read More</p>
        </div>
    );
}

ArticleCard.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    link: PropTypes.string.isRequired,
};

export default ArticleCard;
