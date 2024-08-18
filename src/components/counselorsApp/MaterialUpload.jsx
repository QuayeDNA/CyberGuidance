import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaSpinner } from 'react-icons/fa';

const MaterialsManager = () => {
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('ebooks');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('https://cyber-guidance.onrender.com/api/materials', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMaterials(response.data.materials);
    } catch (error) {
      setError('Failed to fetch materials. Please try again later.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('counselorId', localStorage.getItem('counselorId'));
    formData.append('studentId', 'all');
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('https://cyber-guidance.onrender.com/api/upload-material', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMaterials([...materials, response.data.material]);
      setIsUploading(false);
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (error) {
      setIsUploading(false);
      setError(error.response?.data?.message || 'An error occurred while uploading the material.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://cyber-guidance.onrender.com/api/materials/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMaterials(materials.filter(material => material._id !== id));
    } catch (error) {
      setError('Failed to delete material. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center">Manage Materials</h2>
      
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Material Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
          >
            <option value="ebooks">eBook</option>
            <option value="videos">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            rows="3"
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          >
            {isUploading ? <FaSpinner className="animate-spin mr-2" /> : 'Upload Material'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Materials List */}
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material._id} className="bg-gray-50 p-4 shadow-sm rounded-lg flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-700">{material.title}</p>
              <p className="text-sm text-gray-600">{material.description}</p>
              <p className="text-xs text-gray-500">Type: {material.type}</p>
            </div>
            <button
              onClick={() => handleDelete(material._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <FaTrashAlt className="mr-2" /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsManager;