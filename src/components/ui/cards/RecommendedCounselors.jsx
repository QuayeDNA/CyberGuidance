import { useNavigate } from "react-router-dom";
import counselorsData from '../../data/counselorsData';

const RecommendedCounselors = () => {

  const navigate = useNavigate();
  
  const handleCounselorSelect = (id) => {
    navigate(`/main/counselor/${id}`);
};


  return (
    <div className=" my-8 pb-4">
      <h2 className="text-2xl font-bold my-4">Recommended Counselors</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {counselorsData.map((counselor) => (
          <button key={counselor.id} className="relative flex-shrink-0 w-40 bg-white shadow-lg rounded-lg p-4"  onClick={() => handleCounselorSelect(counselor.id)}>
            <div className="relative">
              <img
                src={counselor.imageUrl}
                alt={counselor.name}
                className="h-32 w-32 object-cover rounded-full mx-auto mb-2"
              />
              <span className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="text-center md:hidden">
              <h3 className="text-sm font-semibold">{counselor.name}</h3>
            </div>
            <div className="hidden md:block text-center">
              <div className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
                <h3 className="text-sm font-semibold">{counselor.name}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCounselors;
