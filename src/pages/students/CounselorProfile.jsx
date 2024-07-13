import { useParams } from 'react-router-dom';
import counselorsData from '../../components/data/counselorsData';

const CounselorProfile = () => {
    const { id } = useParams();
    const counselor = counselorsData.find(c => c.id.toString() === id);

    if (!counselor) {
        return <div className="container mx-auto px-4 mt-8 text-center text-red-500">Counselor not found</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
                <img 
                    src={counselor.imageUrl} 
                    alt={counselor.name} 
                    className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 object-cover"
                />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{counselor.name}</h1>
                <p className="text-lg md:text-xl text-gray-600 mb-4 text-center">
                    {counselor.history}
                </p>
             <div className="flex mb-4 ">
    <strong className="mr-4 self-center">Specialties:</strong>
    <ul className="list-disc list-inside text-base md:text-lg text-gray-600 flex-grow">
        {counselor.specialties.map((specialty, index) => (
            <li key={index}>{specialty}</li>
        ))}
    </ul>
</div>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none w-full">
                    Book a Session
                </button>
            </div>
        </div>
    );
};

export default CounselorProfile;
