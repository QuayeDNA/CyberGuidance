import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { FaInfoCircle, FaCheck } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';

const SetupPage = () => {
    const handleClose = () => {
        // Handle cancel action if needed
        navigate("/user-personalisation")
    };
    const { register, handleSubmit } = useForm();
    const [infoVisible, setInfoVisible] = useState(false);
    const [useTimer, setUseTimer] = useState(true);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);


    useEffect(() => {
        if (open) {
            setInfoVisible(true);
            if (useTimer) {
                const timer = setTimeout(() => {
                    setInfoVisible(false);
                }, 5000); // 5 seconds
                return () => clearTimeout(timer);
            }
        }
    }, [ useTimer]);

    const handleIconClick = () => {
        setUseTimer(false);
        setInfoVisible(!infoVisible);
    };

    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            console.log(data);
            // Store data in local storage
            // localStorage.setItem('userInfo', JSON.stringify(data));
            setSubmissionSuccess(true);
            navigate('/user-personalisation');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (submissionSuccess) {
            const timer = setTimeout(() => {
               // Navigate to the next step
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submissionSuccess]);

    return (
        <div className="max-w-full overflow-hidden rounded-lg sm:max-w-screen-md mx-auto p-4 bg-white shadow-lg my-[20px]">
           <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold">User Information</h2>
                        <FaInfoCircle onClick={handleIconClick} className='text-blue-500 text-xl cursor-pointer' />
                    </div>
                </div>
                {infoVisible && (
                    <p className="mb-6 text-gray-600 bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                        To ensure a personalized experience and to facilitate easy booking of counseling sessions, please fill in your information below. Your data will be securely stored and used only for session booking.
                    </p>
                )}
                {submissionSuccess ? (
                    <div className="flex justify-center items-center h-64">
                        <FaCheck className="text-green-500 text-6xl" />
                    </div>
                ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input {...register("name")} placeholder="Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input {...register("idCardNumber")} placeholder="ID Card Number" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input {...register("yearOfStudy")} placeholder="Year of Study" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input {...register("faculty")} placeholder="Faculty" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <select {...register("religion")} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Religion</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Other">Other</option>
                </select>
                <div className="flex items-center space-x-4">
                    <label className=' '>Gender</label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" {...register("genderMale")} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" {...register("genderFemale")} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Female</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input {...register("age")} placeholder="Age" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input {...register("programme")} placeholder="Programme" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <input {...register("department")} placeholder="Department/Unit" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input {...register("residence")} placeholder="Hall of Residence/Hostel/Place of Abode" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <div className="flex items-center space-x-4">
                    <label className=''>Marital Status: </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" {...register("single")} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Single</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" {...register("married")} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Married</span>
                    </label>
                </div>
                <input {...register("telephoneNumber")} placeholder="Telephone Number" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                
                <div className="grid grid-cols-2 justify-center w-full space-x-4 mt-12">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition">Skip</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Continue</button>
                </div>
            </form>
                )}
        </div>
    );
};

export default SetupPage;
