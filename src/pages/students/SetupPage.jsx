import { useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaIdCard,
  FaGraduationCap,
  FaUniversity,
  FaGlobe,
  FaTransgender,
  FaUserClock,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaPhoneAlt,
  FaPencilAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Background from "../../components/Background";
import { useNavigate } from "react-router-dom";


const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    idCardNumber: "",
    yearOfStudy: "",
    faculty: "",
    religion: "",
    gender: "",
    age: "",
    programOfStudy: "",
    department: "",
    hallOfResidence: "",
    maritalStatus: "",
    mobileNumber: "",
    bio: "",
    profilePicture: null,
  });


  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData(e.target);
      const response = await axios.put(
        "https://cyber-guidance.onrender.com/api/personal-info",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setTimeout(() => {
        navigate("/student/user-personalization");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/student/user-personalization');
};

  return (
    <Background>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto mt-10 z-20">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        {!message && !error && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            Please provide your personal information so we can better understand
            your needs and provide personalized counseling services. This
            information will be kept confidential and used solely for the
            purpose of improving your experience.
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <FaUserCircle className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="fullName"
                className="block font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaIdCard className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="idCardNumber"
                className="block font-medium text-gray-700">
                ID Card Number
              </label>
              <input
                type="text"
                id="idCardNumber"
                name="idCardNumber"
                value={formData.idCardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaGraduationCap className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="yearOfStudy"
                className="block font-medium text-gray-700">
                Year of Study
              </label>
              <input
                type="text"
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUniversity className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="faculty"
                className="block font-medium text-gray-700">
                Faculty
              </label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaGlobe className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="religion"
                className="block font-medium text-gray-700">
                Religion
              </label>
              <input
                type="text"
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaTransgender className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="gender"
                className="block font-medium text-gray-700">
                Gender
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUserClock className="text-gray-500 mr-2" />
            <div>
              <label htmlFor="age" className="block font-medium text-gray-700">
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUserGraduate className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="programOfStudy"
                className="block font-medium text-gray-700">
                Program of Study
              </label>
              <input
                type="text"
                id="programOfStudy"
                name="programOfStudy"
                value={formData.programOfStudy}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUserTie className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="department"
                className="block font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUserShield className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="hallOfResidence"
                className="block font-medium text-gray-700">
                Hall of Residence
              </label>
              <input
                type="text"
                id="hallOfResidence"
                name="hallOfResidence"
                value={formData.hallOfResidence}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaUserTie className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="maritalStatus"
                className="block font-medium text-gray-700">
                Marital Status
              </label>
              <input
                type="text"
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="mobileNumber"
                className="block font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center">
            <FaPencilAlt className="text-gray-500 mr-2" />
            <div>
              <label htmlFor="bio" className="block font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                rows={3}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center">
            <FaCloudUploadAlt className="text-gray-500 mr-2" />
            <div>
              <label
                htmlFor="profilePicture"
                className="block font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
            type="button"
            onClick={handleSkip}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Skip
          </button>
          </div>
        </form>
      </div>
    </Background>
  );
};

export default PersonalInfoForm;
