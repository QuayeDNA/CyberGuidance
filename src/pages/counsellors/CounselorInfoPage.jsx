import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import {
  FaInfoCircle,
  FaCheck,
  FaSpinner,
  FaUpload,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { updatePersonalInfo } from "../../axiosServices/userAccountServices";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  idCardNumber: yup.string().required("ID Card Number is required"),
  religion: yup.string().required("Religion is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Please select a gender")
    .required("Gender is required"),
  bio: yup.string().required("Bio is required"),
  age: yup.number().positive().integer().required("Age is required"),
  department: yup.string().required("Department is required"),
  maritalStatus: yup
    .string()
    .oneOf(["Single", "Married"], "Please select a marital status")
    .required("Marital Status is required"),
  mobileNumber: yup
    .string()
    .matches(/^\+?[0-9]{10,14}$/, "Invalid phone number")
    .required("Mobile Number is required"),
});

const CounselorInfoPage = () => {
  const navigate = useNavigate();
  const [infoVisible, setInfoVisible] = useState(false);
  const [useTimer, setUseTimer] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (infoVisible && useTimer) {
      const timer = setTimeout(() => {
        setInfoVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [infoVisible, useTimer]);

  const handleIconClick = () => {
    setUseTimer(false);
    setInfoVisible(!infoVisible);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await updatePersonalInfo(data, profilePicture);
      console.log(response);
      setSubmissionSuccess(true);
      toast.success(
        response.message || "Personal information updated successfully!"
      );
      setTimeout(() => {
        navigate("/counselor/dashboard");
      }, 2000);
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error.message || "An error occurred while submitting your information."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/counselor/dashboard");
  };

  return (
    <Background>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg my-10 z-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Counselor Information</h2>
          <FaInfoCircle
            onClick={handleIconClick}
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-600 transition-colors"
          />
        </div>
        {infoVisible && (
          <p className="mb-6 text-gray-600 bg-blue-100 border-l-4 border-blue-500 p-4 rounded animate-fade-in">
            Please provide your personal information to create your counselor profile.
          </p>
        )}
        {submissionSuccess ? (
          <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
            <FaCheck className="text-green-500 text-6xl mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Information submitted successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="fullName"
                control={control}
                errors={errors}
                placeholder="Full Name"
              />
              <InputField
                name="idCardNumber"
                control={control}
                errors={errors}
                placeholder="ID Card Number"
              />
              <InputField
                name="religion"
                control={control}
                errors={errors}
                placeholder="Religion"
              />
              <RadioField
                name="gender"
                control={control}
                errors={errors}
                options={["Male", "Female"]}
              />
              <InputField
                name="bio"
                control={control}
                errors={errors}
                placeholder="Bio"
              />
              <InputField
                name="age"
                control={control}
                errors={errors}
                placeholder="Age"
                type="number"
              />
              <InputField
                name="department"
                control={control}
                errors={errors}
                placeholder="Department"
              />
              <RadioField
                name="maritalStatus"
                control={control}
                errors={errors}
                options={["Single", "Married"]}
              />
              <InputField
                name="mobileNumber"
                control={control}
                errors={errors}
                placeholder="Mobile Number"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {previewUrl ? (
                  <div className="text-center">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTimesCircle className="mr-1" /> Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors text-gray-700 font-semibold"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {isLoading ? "Submitting..." : "Continue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Background>
  );
};

const InputField = ({ name, control, errors, placeholder, type = "text", initialValue = "" }) => (
  <div>
    <Controller
      name={name}
      control={control}
      defaultValue={initialValue}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[name] ? "border-red-500" : ""
          }`}
        />
      )}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

const RadioField = ({ name, control, errors, options }) => (
  <div>
    <label className="block mb-2 font-semibold">
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex space-x-4">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                {...field}
                value={option}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
  errors: PropTypes.any.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  initialValue: PropTypes.string,
};

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
  errors: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CounselorInfoPage;