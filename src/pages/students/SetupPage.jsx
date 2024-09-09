import React, { useState } from "react";
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
  FaCloudUploadAlt,
} from "react-icons/fa";
import Background from "../../components/Background";
import { useNavigate } from "react-router-dom";

const PersonalInfoForm = () => {
  const initialFormData = {
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
    profilePicture: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
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
      setTimeout(() => navigate("/student/user-personalization"), 2000);
    } catch (error) {
      setError(
        error.response?.data.message ||
          "An unknown error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate("/student/user-personalization");

  const renderField = (icon, name, label, type = "text", options = null) => (
    <div className="flex items-center mb-4">
      {React.createElement(icon, { className: "text-gray-500 mr-2" })}
      <div className="flex-grow">
        <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
          {label}
        </label>
        {type === "select" ? (
          <select
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "radio" ? (
          <div className="flex space-x-4">
            {options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={formData[name] === option}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ) : type === "file" ? (
          <input
            type={type}
            id={name}
            name={name}
            onChange={handleInputChange}
            className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3"
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full rounded-md shadow-sm border-gray-200 focus:border-blue-500 border-2 focus:ring-blue-500 sm:text-sm p-3"
          />
        )}
      </div>
    </div>
  );

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
            Please provide your personal information for personalized counseling
            services. This information will be kept confidential.
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(FaUserCircle, "fullName", "Full Name")}
          {renderField(FaIdCard, "idCardNumber", "ID Card Number")}
          {renderField(
            FaGraduationCap,
            "yearOfStudy",
            "Year of Study",
            "select",
            ["1st", "2nd", "3rd", "4th", "5th"]
          )}
          {renderField(FaUniversity, "faculty", "Faculty")}
          {renderField(FaGlobe, "religion", "Religion")}
          {renderField(FaTransgender, "gender", "Gender", "radio", [
            "Male",
            "Female",
            "Other",
          ])}
          {renderField(FaUserClock, "age", "Age", "number")}
          {renderField(FaUserGraduate, "programOfStudy", "Program of Study")}
          {renderField(FaUserTie, "department", "Department")}
          {renderField(FaUserShield, "hallOfResidence", "Hall of Residence")}
          {renderField(FaUserTie, "maritalStatus", "Marital Status", "select", [
            "Single",
            "Married",
            "Divorced",
            "Widowed",
          ])}
          {renderField(FaPhoneAlt, "mobileNumber", "Mobile Number", "tel")}
          <div className="md:col-span-2">
            {renderField(
              FaCloudUploadAlt,
              "profilePicture",
              "Profile Picture",
              "file"
            )}
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
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Skip
            </button>
          </div>
        </form>
      </div>
    </Background>
  );
};

export default PersonalInfoForm;