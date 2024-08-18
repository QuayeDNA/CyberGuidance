import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../components/Background";
import { FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CounselorWelcomePage = () => {
    const [stage, setStage] = useState(0);
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const welcomeMessages = [
        "Welcome to CyberGuidance",
        "We're glad you're here to make a difference",
        "As a counselor, you'll be helping students navigate their challenges",
        "Let's personalize your experience",
        "Please select your areas of expertise"
    ];

    const specialties = [
        { name: 'Depression', color: 'bg-blue-400' },
        { name: 'Stress and Anxiety', color: 'bg-green-400' },
        { name: 'Coping with Addictions', color: 'bg-yellow-400' },
        { name: 'Anxiety', color: 'bg-teal-400' },
        { name: 'Family Issues', color: 'bg-orange-400' },
        { name: 'Trauma & Abuse', color: 'bg-red-400' },
        { name: 'Relationship Issues', color: 'bg-purple-400' },
        { name: 'Sexuality Issues', color: 'bg-pink-400' },
        { name: 'Coping with Grief and Loss', color: 'bg-indigo-400' },
        { name: 'Eating Disorder', color: 'bg-cyan-400' },
        { name: 'Sleeping Disorder', color: 'bg-lime-400' },
        { name: 'Motivation, Self-esteem and Confidence', color: 'bg-fuchsia-400' },
        { name: 'Anger Management', color: 'bg-emerald-400' },
        { name: 'Fatigue', color: 'bg-rose-400' },
        { name: 'Career Choices', color: 'bg-violet-400' },
        { name: 'Bipolar Disorder', color: 'bg-amber-400' },
        { name: 'Social Anxiety', color: 'bg-fuchsia-500' },
        { name: 'Goal Setting', color: 'bg-pink-500' },
        { name: 'Concentration, memory and focus (ADHD)', color: 'bg-blue-500' },
        { name: 'Academic Stress', color: 'bg-green-500' },
        { name: 'Productivity', color: 'bg-purple-500' },
        { name: 'Mental Health', color: 'bg-yellow-500' },
        { name: 'Career Guidance', color: 'bg-teal-500' },
        { name: 'Financial Guidance', color: 'bg-orange-500' },
        { name: 'Study Techniques', color: 'bg-lime-500' },
        { name: 'Time Management', color: 'bg-red-500' },
        { name: 'Personal Development', color: 'bg-indigo-500' },
        { name: 'Exams Preparation', color: 'bg-cyan-500' },
    ];

    useEffect(() => {
        if (stage < welcomeMessages.length - 1) {
            const timer = setTimeout(() => setStage(stage + 1), 2000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const toggleSpecialty = (specialty) => {
        setSelectedSpecialties((prev) =>
            prev.includes(specialty)
                ? prev.filter((i) => i !== specialty)
                : [...prev, specialty]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const response = await fetch('https://cyber-guidance.onrender.com/api/counselor/specialties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: localStorage.getItem('counselorEmail'),
                    specialties: selectedSpecialties.join(', ')
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update specialties');
            }

            const data = await response.json();
            console.log(data.message);
            navigate('/counselor/dashboard');
        } catch (error) {
            console.error('Error updating specialties:', error);
            setIsSubmitting(false);
            setErrorMessage(error.message);
        }
    };

    if (isSubmitting) {
        return (
            <Background>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />
                    <p className="text-xl font-semibold text-gray-700">
                        Setting up your profile...
                    </p>
                </div>
            </Background>
        );
    }

    return (
        <Background>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                    <AnimatePresence>
                        {stage < welcomeMessages.length - 1 ? (
                            <motion.div
                                key={stage}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h2 className="text-4xl font-bold text-gray-900">
                                    {welcomeMessages[stage]}
                                </h2>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Select Your Areas of Expertise
                                </h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Choose the areas you specialize in. This will help us match you with students who need your expertise.
                                </p>
                                {errorMessage && (
                                    <p className="text-red-500 text-center mt-4">{errorMessage}</p>
                                )}
                                <div className="mt-8 space-y-6">
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {specialties.map((specialty) => (
                                            <button
                                                key={specialty.name}
                                                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${selectedSpecialties.includes(specialty.name)
                                                    ? `${specialty.color} text-white shadow-lg transform scale-105`
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                                onClick={() => toggleSpecialty(specialty.name)}
                                            >
                                                {specialty.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                                            onClick={() => setSelectedSpecialties([])}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Background>
    );
};

export default CounselorWelcomePage;