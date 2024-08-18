import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import articlesData from '../../components/data/articlesData';

const Articles = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedArticle, setSelectedArticle] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('list');
  const [newArticle, setNewArticle] = useState({
    title: '',
    writtenBy: '',
    description: '',
    content: '',
    imageUrl: ''
  });
  const articlesPerPage = 4;

  useEffect(() => {
    const article = articlesData.find((article) => article.id === parseInt(id)) || articlesData[0];
    setSelectedArticle(article);
  }, [id]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    navigate(`/student/articles/${article.id}`);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articlesData.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(articlesData.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleContentChange = (value) => {
    setNewArticle({ ...newArticle, content: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewArticle({ ...newArticle, imageUrl: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save the new article
    console.log('New Article:', newArticle);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-6">
        <button
          className={`px-4 py-2 rounded-full focus:outline-none transition-all duration-300 ${
            activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('list')}
        >
          List of Articles
        </button>
        <button
          className={`px-4 py-2 rounded-full focus:outline-none transition-all duration-300 ${
            activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Create Article
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Full Article */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
              />
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{selectedArticle.title}</h2>
              <p className='text-blue-600 mb-4 font-medium'>Written By: {selectedArticle.writtenBy}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{selectedArticle.description}</p>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
          </div>

          {/* Right Column: List of Articles */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">More Articles</h2>
            <div className="space-y-6">
              {currentArticles.map((article) => (
                <button
                  key={article.id}
                  className={`w-full p-4 text-left bg-white shadow-md rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-blue-50 ${
                    selectedArticle.id === article.id ? 'border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full sm:w-1/3 h-32 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.description}</p>
                      <p className="text-blue-500 text-sm">By {article.writtenBy}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 mx-1 rounded-full focus:outline-none transition-all duration-300 ${
                    currentPage === number 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Article</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newArticle.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="writtenBy" className="block text-sm font-medium text-gray-700">
                Written By
              </label>
              <input
                type="text"
                id="writtenBy"
                name="writtenBy"
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newArticle.writtenBy}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newArticle.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <ReactQuill
                value={newArticle.content}
                onChange={handleContentChange}
                className="mt-1"
                theme="snow"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleImageUpload}
              />
              {newArticle.imageUrl && (
                <img
                  src={newArticle.imageUrl}
                  alt="Uploaded"
                  className="mt-4 w-full h-64 object-cover rounded-lg shadow-md"
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Articles;