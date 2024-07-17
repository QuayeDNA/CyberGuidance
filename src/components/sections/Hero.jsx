import { useState } from 'react';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaChevronDown, FaArrowRight } from 'react-icons/fa';
import backgroundImage from '../../assets/Counselling.jpg'; // replace with the path to your image
import BookSessionButton from '../ui/button/bookSessionButton';

const Hero = () => {
  const [tooltipText, setTooltipText] = useState('');

  const socialLinks = [
    { href: 'https://facebook.com', icon: <FaFacebookF />, name: 'Facebook' },
    { href: 'https://twitter.com', icon: <FaTwitter />, name: 'Twitter' },
    { href: 'https://instagram.com', icon: <FaInstagram />, name: 'Instagram' },
    { href: 'https://linkedin.com', icon: <FaLinkedinIn />, name: 'LinkedIn' },
  ];

  const handleMouseEnter = (name) => {
    setTooltipText(name);
  };

  const handleMouseLeave = () => {
    setTooltipText('');
  };

  return (
    <section id='home' className="hero relative h-screen shadow-xl bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto h-full flex items-center justify-between px-8 ">
        <div className="text-left text-white max-w-2xl z-[9]">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">We&apos;re here to provide you with professional, compassionate counseling and guidance.</h1>
          <p className="text-sm md:text-md lg:text-lg mt-4 xl:text-xl">Our team of experienced counselors are here to help you navigate through life&apos;s challenges and uncertainties.</p>
         <div className='mt-4 group inline-flex items-center'>
          <BookSessionButton className="border border-white text-white rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-700 shadow-md"/>
         <FaArrowRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-2" />
         </div>
         
        </div>
        <div className="hidden md:flex flex-col items-center justify-center space-y-4 lg:space-y-8 z-10 absolute right-5 mr-2 top-1/2 transform -translate-y-1/2">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <a
                href={link.href}
                className="text-white text-xl lg:text-2xl hover:text-gray-700 transition duration-300"
                onMouseEnter={() => handleMouseEnter(link.name)}
                onMouseLeave={handleMouseLeave}
              >
                {link.icon}
              </a>
              {tooltipText === link.name && (
                <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 ml-[-16px] bg-gray-800 text-white text-md py-1 px-2 rounded-lg">
                  {link.name}
                </div>
              )}
            </div>
          ))}
          <div className="h-40 w-[1px] bg-white mt-2"></div>
          <div className="flex flex-col items-center mt-4">
            <FaChevronDown className="animate-bounce w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
