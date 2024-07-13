import { useState } from 'react';

const Materials = () => {
  const [activeTab, setActiveTab] = useState('ebooks');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
        {activeTab === 'ebooks' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">eBooks</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">eBook 1</p>
                <p className="text-sm text-gray-600">Description of eBook 1</p>
              </div>
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">eBook 2</p>
                <p className="text-sm text-gray-600">Description of eBook 2</p>
              </div>
              {/* Add more eBooks here */}
            </div>
          </div>
        )}
        {activeTab === 'videos' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Videos</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Video 1</p>
                <p className="text-sm text-gray-600">Description of Video 1</p>
              </div>
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Video 2</p>
                <p className="text-sm text-gray-600">Description of Video 2</p>
              </div>
              {/* Add more Videos here */}
            </div>
          </div>
        )}
        {activeTab === 'audio' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Audio</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Audio 1</p>
                <p className="text-sm text-gray-600">Description of Audio 1</p>
              </div>
              <div className="bg-gray-50 p-4 shadow-sm rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Audio 2</p>
                <p className="text-sm text-gray-600">Description of Audio 2</p>
              </div>
              {/* Add more Audio Recordings here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
