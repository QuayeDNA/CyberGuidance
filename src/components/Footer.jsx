import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-gray-700 text-white py-6 z-100">
            <div className="container mx-auto px-2 flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-2 md:mb-0">
                    <p className="text-sm">&copy; 2024 Guidance and Counseling Office, Takoradi Technical University (TTU). All rights reserved.</p>
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-white hover:text-gray-400 transition">
                        <FaFacebook size={24} />
                    </a>
                    <a href="#" className="text-white hover:text-gray-400 transition">
                        <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-white hover:text-gray-400 transition">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
