import { NavLink, useLocation } from 'react-router-dom';
import { FaUserCircle, FaUserAlt, FaHome, FaComment, FaRegNewspaper } from 'react-icons/fa';

function AppNavbar() {
    const location = useLocation();

    const navLinks = [
        { id: 1, to: '/student/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/student/counselors', icon: <FaUserAlt className="mr-2" />, text: 'Counselors' },
        { id: 3, to: "/student/appointment", icon: <FaUserAlt className="mr-2" />, text: "Appointments", },
        { id: 4, to: '/student/message', icon: <FaComment className="mr-2" />, text: 'Messages' },
        { id: 5, to: '/student/user', icon: <FaUserCircle className='mr-2' />, text: "User" },
        { id: 6, to: '/student/articles', icon: <FaRegNewspaper className='mr-2' />, text: "Articles" }
    ];
    return (
        <nav className="bg-white shadow-md py-4 border-t border-gray-100 fixed z-10 w-full mt-16 block lg:hidden bottom-0">
            <div className="mx-auto px-2 flex justify-center items-center">

                {/* Small screen navigation */}
                <div className="space-x-4 flex items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.id}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-gray-700 transition duration-200 flex items-center ${isActive ? 'bg-blue-500 py-2 px-4 text-white rounded-full' : ''}`
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
