import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Counselors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('https://cyber-guidance.onrender.com/api/all-counselors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
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
                        key={counselor._id}
                        className="text-center cursor-pointer p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg rounded-lg bg-white border border-gray-200"
                        onClick={() => handleCounselorSelect(counselor)}
                    >
                        <div className="lg:w-24 lg:h-24 mx-auto rounded-full overflow-hidden mb-4 md:w-20 md:h-20 w-16 h-auto">
                            <img src={counselor.imageUrl || 'default-avatar.png'} alt={counselor.username} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-md md:text-lg lg:text-xl font-bold">{counselor.username}</h2>
                        <p className="text-xs md:text-sm lg:text-base text-gray-600">{counselor.email}</p>
                        <div className="mt-2">
                            {counselor.specialties.map((specialty, index) => (
                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Counselors;