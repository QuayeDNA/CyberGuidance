import { useState } from "react";
import Footer from "../../components/Footer";
import bgImage from "../../assets/Counselling.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();
    const handleSignup = (e) => {
        e.preventDefault()
        // Add yoursignup logic here. If signup is successful, navigate to the Dashboard.
        // For now, we'll assume signup is always successful.

        navigate('/setup')
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative flex-grow flex items-center justify-center">
                <div className="absolute inset-0">
                    <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-6">
                    <h2 className="text-2xl font-bold text-center mb-6">Sign Up for CyberGuidance</h2>
                    <p className="text-center text-gray-600 mb-4">Create your account to get started.</p>
                    <form action="#" method="POST">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
                            <input type="text" id="username" name="username" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                            <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                            <input type={showPassword ? "text" : "password"} id="password" name="password" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center h-full">
                                <button type="button" onClick={handlePasswordVisibility} className="text-gray-500 h-full flex items-center pt-8">
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                            <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center h-full">
                                <button type="button" onClick={handlePasswordVisibility} className="text-gray-500 h-full flex items-center pt-8">
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleSignup}>Sign Up</button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        By signing up, you agree to our
                        <Link to="/terms" className="text-blue-500 hover:underline">Terms</Link> and
                        <Link to="/services" className="text-blue-500 hover:underline">Services</Link>.
                    </p>

                    <p className="text-center text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Signup;
