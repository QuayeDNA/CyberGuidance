    import Footer from "../../components/Footer";
    import bgImage from "../../assets/Counselling.jpg";
    import { useNavigate, Link  } from 'react-router-dom'

    function Login() {
        const navigate = useNavigate();
        // Assuming you have a function to check if the user is logged in
    // For example, checking if a token exists in localStorage
    const isLoggedIn = () => {
        return localStorage.getItem("userToken") !== null;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Add your login logic here. If login is successful, navigate to the Dashboard.
        // For now, we'll assume login is always successful.
        
        // After login logic, set the token or login status
        // localStorage.setItem("userToken", "yourTokenHere");

        navigate('/setup');
    };

    // Redirect user if already logged in
    if (isLoggedIn()) {
        navigate('/dashboard'); // Assuming '/dashboard' is the path for the main/dashboard page
    }

        return (
            <div className="flex flex-col min-h-screen">
                <div className="relative flex-grow flex items-center justify-center">
                    <div className="absolute inset-0">
                        <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-6">CyberGuidance Counsellors</h2>
                        <p className="text-center text-gray-600 mb-4">We are here to support you. Please log in to continue.</p>
                        <form action="#" method="POST">
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
                                <input type="text" id="username" name="username" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                                <input type="password" id="password" name="password" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleLogin}>Log In</button>
                        </form>
                        <p className="text-center text-gray-600 mt-4">Don&apos;t have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    export default Login;
