import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import BasketballIcon from "../../public/BasketBall Icon.svg";
import './css/ComingSoon.css'; // Import the custom CSS file

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
    >
      <img
        src={BasketballIcon}
        alt="Basketball Icon"
        className="h-20 w-20 bounce-animation"
      />
      <div className="bg-black bg-opacity-60 p-10 rounded-lg text-center max-w-lg mx-4">
        <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-gray-300 mb-6">
          We&apos;re working hard to bring you something amazing! Stay tuned for updates.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <IoIosArrowBack className="mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
