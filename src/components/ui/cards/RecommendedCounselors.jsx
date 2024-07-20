import { useNavigate } from "react-router-dom";
import counselorsData from '../../data/counselorsData';

const RecommendedCounselors = () => {
  const navigate = useNavigate();
  
  const handleCounselorSelect = (id) => {
    navigate(`/student/counselor/${id}`);
  };

  return (
    <div className="my-4 pb-4">
      <h2 className="text-md sm:text-lg md:text-xl font-bold my-4">Recommended Counselors</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {counselorsData.map((counselor) => (
          <button 
            key={counselor.id} 
            className="relative flex-shrink-0 w-32 sm:w-40 md:w-48 bg-white shadow-lg rounded-lg p-3 sm:p-4 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
            onClick={() => handleCounselorSelect(counselor.id)}
          >
            <div className="relative">
              <img
                src={counselor.imageUrl}
                alt={counselor.name}
                className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 object-cover rounded-full mx-auto mb-2"
              />
              <span className="absolute bottom-2 right-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="text-center">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold">{counselor.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">{counselor.specialization}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCounselors;