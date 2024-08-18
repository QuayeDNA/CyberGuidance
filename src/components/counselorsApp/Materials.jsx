// MaterialsDisplay.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const MaterialsDisplay = () => {
  const [activeTab, setActiveTab] = useState('ebooks');
  const [materials, setMaterials] = useState({
    ebooks: [],
    videos: [],
    audio: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('https://cyber-guidance.onrender.com/api/materials', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const fetchedMaterials = response.data.materials;
      setMaterials({
        ebooks: fetchedMaterials.filter(m => m.type === 'ebooks'),
        videos: fetchedMaterials.filter(m => m.type === 'videos'),
        audio: fetchedMaterials.filter(m => m.type === 'audio')
      });
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch materials. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderMaterialList = (materialList) => (
    <div className="space-y-4">
      {materialList.map((material) => (
        <div key={material._id} className="bg-gray-50 p-4 shadow-sm rounded-lg">
          <p className="text-sm font-semibold text-gray-700">{material.title}</p>
          <p className="text-sm text-gray-600">{material.description}</p>
          <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View Material
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-center mb-4 border-b border-gray-200">
        <button
          className={`flex-1 py-2 transition-colors duration-300 ${
            activeTab === 'ebooks'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => handleTabClick('ebooks')}
        >
          eBooks
        </button>
        <button
          className={`flex-1 py-2 transition-colors duration-300 ${
            activeTab === 'videos'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => handleTabClick('videos')}
        >
          Videos
        </button>
        <button
          className={`flex-1 py-2 transition-colors duration-300 ${
            activeTab === 'audio'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => handleTabClick('audio')}
        >
          Audio
        </button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-center">Loading materials...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            {renderMaterialList(materials[activeTab])}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsDisplay;