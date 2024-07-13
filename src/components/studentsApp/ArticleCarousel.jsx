import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArticleCard from '../ui/cards/ArticleCard';
import PropTypes from 'prop-types';
import Card from '../ui/cards/Card';

const ArticlesCarousel = ({ articles }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Card title="Articles" showAllLink={{ link: '/main/articles', text: 'Read More' }}>
            <Slider {...settings}>
                {articles.map((article) => (
                    <div key={article.id}>
                        <ArticleCard
                            title={article.title}
                            imageUrl={article.imageUrl}
                            description={article.description}
                            link={article.link}
                        />
                    </div>
                ))}
            </Slider>
        </Card>
    );
}

ArticlesCarousel.propTypes = {
    articles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        description: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
    })).isRequired,
};

export default ArticlesCarousel;
