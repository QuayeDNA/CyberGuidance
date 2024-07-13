import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articlesData from '../../components/data/articlesData';

const Articles = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to manage selected article and pagination
  const [selectedArticle, setSelectedArticle] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  // Effect to set selected article when id changes
  useEffect(() => {
    const article = articlesData.find((article) => article.id === parseInt(id)) || articlesData[0];
    setSelectedArticle(article);
  }, [id]);

  // Function to handle article click
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    navigate(`/main/articles/${article.id}`);
  };

  // Calculate which articles to display on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articlesData.slice(indexOfFirstArticle, indexOfLastArticle);

  // Function to change current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(articlesData.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Article */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
            <p className='text-blue-600'>Written By: {selectedArticle.writtenBy}</p>
            <p className="text-gray-700 mb-4">{selectedArticle.description}</p>
            {/* Render content using dangerouslySetInnerHTML */}
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
          </div>
        </div>

        {/* Right Column: List of Articles */}
        <div>
          <h2 className="text-xl font-bold mb-4">Articles</h2>
          <div className="space-y-4 flex flex-col">
            {currentArticles.map((article) => (
              <button
                key={article.id}
                className={`p-2 text-left bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedArticle.id === article.id ? 'border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex flex-col items-center space-x-4">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    <p className="text-gray-500 mb-2">{article.description}</p>
                    <p className="text-gray-500">Written By: {article.writtenBy}</p>
                  </div>
                </div>
              </button>
            ))}
            {/* Pagination */}
            <div className="mt-4">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 text-sm rounded-md mr-2 focus:outline-none ${
                    currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
