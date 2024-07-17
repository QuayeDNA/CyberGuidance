import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { FaInfoCircle, FaCheck, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Background from "../../components/Background";

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  idCardNumber: yup.string().required('ID Card Number is required'),
  yearOfStudy: yup.number().positive().integer().required('Year of Study is required'),
  faculty: yup.string().required('Faculty is required'),
  religion: yup.string().required('Religion is required'),
  gender: yup.string().oneOf(['male', 'female'], 'Please select a gender').required('Gender is required'),
  age: yup.number().positive().integer().required('Age is required'),
  programme: yup.string().required('Programme is required'),
  department: yup.string().required('Department/Unit is required'),
  residence: yup.string().required('Residence is required'),
  maritalStatus: yup.string().oneOf(['single', 'married'], 'Please select a marital status').required('Marital Status is required'),
  telephoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Telephone Number is required'),
});

const SetupPage = () => {
  const navigate = useNavigate();
  const [infoVisible, setInfoVisible] = useState(false);
  const [useTimer, setUseTimer] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  const onSubmit = async (data) => {
    try {
      console.log(data);
      setSubmissionSuccess(true);
      setTimeout(() => {
        navigate('/student/user-personalization');
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    navigate("/student/user-personalization");
  };

  if (isLoading) {
    return (
      <Background>
        <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="max-w-full overflow-hidden rounded-lg sm:max-w-screen-md mx-auto p-6 bg-white shadow-lg my-[20px] z-10 transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold text-blue-600">User Information</h2>
            <FaInfoCircle onClick={handleIconClick} className='text-blue-500 text-xl cursor-pointer hover:text-blue-600 transition-colors' />
          </div>
        </div>
        {infoVisible && (
          <p className="mb-6 text-gray-600 bg-blue-100 border-l-4 border-blue-500 p-4 rounded animate-fade-in">
            To ensure a personalized experience and to facilitate easy booking of counseling sessions, please fill in your information below. Your data will be securely stored and used only for session booking.
          </p>
        )}
        {submissionSuccess ? (
          <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
            <FaCheck className="text-green-500 text-6xl mb-4" />
            <p className="text-xl font-semibold text-gray-700">Information submitted successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input {...field} placeholder="Name" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Controller
                  name="idCardNumber"
                  control={control}
                  render={({ field }) => (
                    <input {...field} placeholder="ID Card Number" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.idCardNumber ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.idCardNumber && <p className="text-red-500 text-sm mt-1">{errors.idCardNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="yearOfStudy"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="number" placeholder="Year of Study" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.yearOfStudy ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.yearOfStudy && <p className="text-red-500 text-sm mt-1">{errors.yearOfStudy.message}</p>}
              </div>
              <div>
                <Controller
                  name="faculty"
                  control={control}
                  render={({ field }) => (
                    <input {...field} placeholder="Faculty" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.faculty ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>}
              </div>
            </div>

            <div>
              <Controller
                name="religion"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.religion ? 'border-red-500' : ''}`}>
                    <option value="">Select Religion</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              />
              {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block mb-2 font-semibold">Gender</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" {...field} value="male" className="form-radio h-5 w-5 text-blue-600" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" {...field} value="female" className="form-radio h-5 w-5 text-blue-600" />
                      <span>Female</span>
                    </label>
                  </div>
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="number" placeholder="Age" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
              <div>
                <Controller
                  name="programme"
                  control={control}
                  render={({ field }) => (
                    <input {...field} placeholder="Programme" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.programme ? 'border-red-500' : ''}`} />
                  )}
                />
                {errors.programme && <p className="text-red-500 text-sm mt-1">{errors.programme.message}</p>}
              </div>
            </div>

            <div>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="Department/Unit" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : ''}`} />
                )}
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
            </div>

            <div>
              <Controller
                name="residence"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="Hall of Residence/Hostel/Place of Abode" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.residence ? 'border-red-500' : ''}`} />
                )}
              />
              {errors.residence && <p className="text-red-500 text-sm mt-1">{errors.residence.message}</p>}
            </div>

            <div>
              <label htmlFor='marital-status'  className="block mb-2 font-semibold">Marital Status</label>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" {...field} value="single" className="form-radio h-5 w-5 text-blue-600" />
                      <span>Single</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" {...field} value="married" className="form-radio h-5 w-5 text-blue-600" />
                      <span>Married</span>
                    </label>
                  </div>
                )}
              />
              {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>}
            </div>

            <div>
              <Controller
                name="telephoneNumber"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="Telephone Number" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telephoneNumber ? 'border-red-500' : ''}`} />
                )}
              />
              {errors.telephoneNumber && <p className="text-red-500 text-sm mt-1">{errors.telephoneNumber.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button type="button" onClick={handleClose} className="px-6 py-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors text-gray-700 font-semibold">Skip</button>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold">Continue</button>
            </div>
          </form>
        )}
      </div>
    </Background>
  );
};

export default SetupPage;