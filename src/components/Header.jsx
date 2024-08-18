import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import BookSessionButton from '../components/ui/button/bookSessionButton';
import './css/Header.css'; // Import the custom CSS file

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  localStorage.clear(); // clear local storage
  const links = [
    { to: 'home', text: 'Home' },
    { to: 'about', text: 'About' },
    { to: 'services', text: 'Services' },
    { to: 'testimonials', text: 'Testimonials' },
    { to: 'contact', text: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
      <header className={`fixed h-20 w-full top-0 left-0 z-[10] transition-colors duration-500 ${scrolled ? 'bg-gray-700 shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center py-4 px-8 z-50">
          <div className="flex items-center z-50">
            <div className="flex items-center space-x-4 mr-12">
              {/* Logo and App Name */}
              <img src="/logo/Logo.svg" alt="TTU Counseling Logo" className="h-10" />
              <span className="text-white text-xl font-semibold">Cyber Counselling</span>
            </div>
            {/* Navigation Links for Medium and Larger Screens */}
            <nav className="hidden lg:flex space-x-6 ml-4">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  activeClass="text-white border-b-2 border-white"
                  className="text-white hover:text-gray-700 transition duration-300 ease-in"
                  onClick={handleLinkClick}
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          <BookSessionButton className="ml-auto hidden lg:block mr-4 border border-white text-white rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-700 shadow-md" />

          <button onClick={handleLoginClick} className='bg-gray-700 px-4 py-2 hover:bg-gray-700 text-white rounded-md cursor-pointer transition duration-300 ease-in-out hidden lg:block'>Login</button>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="lg:hidden text-white focus:outline-none z-[21]">
            {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Navigation Menu */}
        <nav className={`pt-20 lg:hidden fixed top-0 left-0 w-full bg-gray-700 text-white transition-transform duration-300 ${menuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
          <button onClick={handleLoginClick} className='block py-4 px-6 text-left border-b border-blue-400 hover:bg-gray-700 w-full transition duration-200 ease-in cursor-pointer'>Login</button>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              activeClass="bg-gray-700 text-white border-b-2 border-white"
              className="block py-4 px-6 text-left border-b border-blue-400 hover:bg-gray-700 w-full transition duration-200 ease-in"
              onClick={handleLinkClick}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </header>
  );
};

export default Header;
