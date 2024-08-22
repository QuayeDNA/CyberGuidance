import { useState } from "react";
import axios from "axios";
import { FaUser, FaBuilding, FaPhone, FaInfoCircle } from "react-icons/fa";
import Background from "../../components/Background";
import { useNavigate } from "react-router-dom";

const CounselorInfoForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    mobileNumber: "",
    bio: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Updating your profile...");
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      
      await axios.put("https://cyber-guidance.onrender.com/api/personal-info", formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/counselor/dashboard"), 2000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <div className="max-w-4xl mx-auto px-4 py-8 z-[20]">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Counselor Profile</h2>
          </div>
          <div className="p-6">
            {message && (
              <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                        className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3 pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                     className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3 pl-10"
                      placeholder="Counseling Services"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      id="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                     className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3 pl-10"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    onChange={handleInputChange}
                     className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3 pl-10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FaInfoCircle className="text-gray-400" />
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                  className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3 pl-10"
                    placeholder="Tell us about yourself and your expertise..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default CounselorInfoForm;