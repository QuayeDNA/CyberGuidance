import { NavLink, useLocation } from 'react-router-dom';
import { FaUserCircle, FaUserAlt, FaHome, FaComment, FaTools } from 'react-icons/fa';

function AppNavbar() {
    const location = useLocation();

    const navLinks = [
        { id: 1, to: '/main/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/main/counselors', icon: <FaUserAlt className="mr-2" />, text: 'Counselors' },
        { id: 3, to: '/main/message', icon: <FaComment className="mr-2" />, text: 'Messages' },
        { id: 4, to: '/main/user', icon: <FaUserCircle className='mr-2' />, text: "User" },
        { id: 5, to: '/main/articles', icon: <FaTools className='mr-2' />, text: "Materials" }
    ];
    return (
        <nav className="bg-white shadow-md py-4 border-t-[1px] border-gray-100 fixed z-10 w-full mt-16 block md:hidden bottom-0">
            <div className="mx-auto px-2 flex justify-center items-center">


                {/* Small screen navigation */}
                <div className="space-x-4 flex items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.id}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-gray-700 transition duration-200 flex items-center ${isActive ? 'bg-blue-500 py-1 px-2 text-white rounded-full' : ''}`
                            }
                        >
                            {link.icon}
                            <span className={`${location.pathname === link.to ? 'block' : 'hidden'}`}>{link.text}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default AppNavbar;
