import { FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FaExclamationCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h1 className="text-2xl font-bold mt-4">Unauthorized Access</h1>
                <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
                <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;