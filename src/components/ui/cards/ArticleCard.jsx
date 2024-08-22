import PropTypes from 'prop-types';

const ArticleCard = ({ title, imageUrl, }) => {




    return (
        <div className='mt-4'>
            {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <p className="font-bold text-lg mb-2">{title}</p>
        </div>
    );
}

ArticleCard.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    link: PropTypes.string.isRequired,
};

export default ArticleCard;
