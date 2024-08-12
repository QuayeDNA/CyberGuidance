import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import counselorsData from '../../components/data/counselorsData';
import { FaSearch } from 'react-icons/fa';

const Counselors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [bookedCounselor, setBookedCounselor] = useState(null);
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCounselors = counselorsData.filter(counselor =>
        counselor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCounselorSelect = (counselor) => {
        setBookedCounselor(counselor);
        localStorage.setItem('bookedCounselor', JSON.stringify(counselor));
        navigate(`/student/counselor/${counselor.id}`);
    };


    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">Counselors</h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 text-center">
                Book a counseling session with one of our experienced counselors.
            </p>
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search counselors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-0 top-[6px] mt-3 ml-3 text-gray-500">
                    <FaSearch />
                </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredCounselors.map((counselor) => (
                    <button
                        key={counselor.id}
                        className="text-center cursor-pointer p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg rounded-lg bg-white border border-gray-200"
                        onClick={() => handleCounselorSelect(counselor)}
                    >
                        <div className="lg:w-24 lg:h-24 mx-auto rounded-full overflow-hidden mb-4 md:w-20 md:h-20 w-16 h-auto">
                            <img src={counselor.imageUrl} alt={counselor.name} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-md md:text-lg lg:text-xl font-bold">{counselor.name}</h2>
                        <p className="text-xs md:text-sm lg:text-base text-gray-600">{counselor.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Counselors;