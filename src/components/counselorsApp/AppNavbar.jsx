import { NavLink, useLocation } from 'react-router-dom';
import { FaUserCircle, FaCalendarAlt, FaHome, FaComments, FaRegNewspaper } from 'react-icons/fa';

function AppNavbar() {
    const location = useLocation();

    const navLinks = [
        { id: 1, to: '/counselor/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/counselor/sessions', icon: <FaCalendarAlt className="mr-2" />, text: 'Sessions' },
        { id: 3, to: '/counselor/messages', icon: <FaComments className="mr-2" />, text: 'Messages' },
        { id: 4, to: '/counselor/profile', icon: <FaUserCircle className='mr-2' />, text: "Profile" },
        { id: 5, to: '/counselor/articles', icon: <FaRegNewspaper className='mr-2' />, text: "Articles" }
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