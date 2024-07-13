
import counselorsData from '../../data/counselorsData';

const RecommendedCounselors = () => {
  return (
    <div className="overflow-x-auto my-8 pb-4">
      <h2 className="text-2xl font-bold mb-4">Recommended Counselors</h2>
      <div className="flex space-x-4">
        {counselorsData.map((counselor) => (
          <div key={counselor.id} className="relative flex-shrink-0 w-40 bg-white shadow-lg rounded-lg p-4">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCounselors;
