import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { updateSpecialties } from "../../axiosServices/userAccountServices";

const CounselorWelcomePage = () => {
  const [stage, setStage] = useState(0);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [setupProgress, setSetupProgress] = useState(0);
  const navigate = useNavigate();

  const welcomeMessages = [
    "Welcome to CyberCounseling",
    "We're glad you're here to make a difference",
    "As a counselor, you'll be helping students and staff navigate their challenges",
    "Let's personalize your experience",
    "Please select your areas of expertise",
  ];

  const specialties = [
    { name: "Mental Health Support", color: "bg-blue-400" },
    { name: "Harassment", color: "bg-green-400" },
    { name: "Personal Development and Goal Setting", color: "bg-yellow-400" },
    { name: "Stress Management and Anxiety Reduction", color: "bg-teal-400" },
    { name: "Time Management and Productivity", color: "bg-orange-400" },
    { name: "Relationship Management and Coping Skills", color: "bg-red-400" },
    { name: "Academic Success and Motivation", color: "bg-purple-400" },
    { name: "Business Development", color: "bg-pink-400" },
    { name: "General", color: "bg-indigo-400" },
  ];

  useEffect(() => {
    if (stage < welcomeMessages.length - 1) {
      const timer = setTimeout(() => setStage(stage + 1), 2500);
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
    setErrorMessage("");
    try {
      // Convert selected specialties to lowercase
      const specialtiesInLowerCase = selectedSpecialties.map(specialty =>
        specialty.toLowerCase()
      );

      // Send the request to update specialties
      const response = await updateSpecialties({ specialties: specialtiesInLowerCase });

      if (response && response.message === "Specialties updated successfully") {
        console.log("Specialties updated:", response.counselor.specialties);

        // Simulate setup process
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setSetupProgress(i);
        }

        navigate("/counselor/setup");
      } else {
        setErrorMessage("Failed to update specialties. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error updating specialties: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <Background>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-4">
            Setting up your profile...
          </p>
          <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${setupProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-gray-600">{setupProgress}% Complete</p>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <AnimatePresence mode="wait">
            {stage < welcomeMessages.length - 1 ? (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y:  50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-400">
                  {welcomeMessages[stage]}
                </h2>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="mt-6 text-center text-2xl sm:text-xl md:text-5xl font-extrabold text-gray-900">
                  Select Your Areas of Expertise
                </h2>
                <p className="mt-2 text-center text-sm sm:text-base md:text-lg text-gray-600">
                  Choose the areas you specialize in. This will help us match you with students who need your expertise.
                </p>
                {errorMessage && (
                  <p className="text-red-500 text-center mt-4">
                    {errorMessage}
                  </p>
                )}
                <div className="mt-8 space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {specialties.map((specialty) => (
                      <motion.button
                        key={specialty.name}
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-300 ease-in-out ${selectedSpecialties.includes(specialty.name)
                            ? `${specialty.color} text-white shadow-lg transform scale-105`
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } text-xs sm:text-sm md:text-base border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                        onClick={() => toggleSpecialty(specialty.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {specialty.name}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 sm:pt-6 md:pt-8">
                    <motion.button
                      type="button"
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base md:text-lg font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                      onClick={() => setSelectedSpecialties([])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset
                    </motion.button>
                    <motion.button
                      type="button"
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base md:text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit
                    </motion.button>
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