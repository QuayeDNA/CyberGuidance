import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/contexts/AuthContext';

const Counselors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useAuth();

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            if (!userData || !userData.token) {
                throw new Error('No token found');
            }

            const response = await axios.get('https://cyber-guidance.onrender.com/api/all-counselors', {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            });

            if (response.status === 200) {
                setCounselors(response.data.counselors);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching counselors:', error);
            toast.error('Failed to fetch counselors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCounselors = counselors.filter(counselor =>
        counselor.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCounselorSelect = (counselor) => {
        navigate(`/student/counselor/${counselor._id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className=" min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-gray-800">
                    Find Your Counselor
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-8 text-center text-gray-600">
                    Book a counseling session with one of our experienced professionals.
                </p>
                <div className="mb-8 max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search counselors..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full p-4 pl-12 pr-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaSearch className="text-xl" />
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCounselors.map((counselor) => (
    <div
        key={counselor._id}
        className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="p-6">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <img src={counselor.imageUrl || `https://ui-avatars.com/api/?name=${counselor.username}&background=random`} alt={counselor.username} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2 truncate">{counselor.username}</h2>
            <p className="text-sm text-gray-600 text-center mb-4 break-words">{counselor.email}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {counselor.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full whitespace-nowrap">
                        {specialty}
                    </span>
                ))}
            </div>
            <button
                onClick={() => handleCounselorSelect(counselor)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
                Book Session
            </button>
        </div>
    </div>
))}
                </div>
            </div>
        </div>
    );
};

export default Counselors;