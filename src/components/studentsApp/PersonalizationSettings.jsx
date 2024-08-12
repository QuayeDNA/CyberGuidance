import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const PersonalizationSettings = () => {
    const [selectedIssues, setSelectedIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const issues = [
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
        const fetchAreaOfInterest = async () => {
            try {
                const response = await fetch('https://cyber-guidance.onrender.com/user-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ email: localStorage.getItem('userEmail') })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const data = await response.json();
                if (data.user && data.user.areaOfInterest) {
                    setSelectedIssues(data.user.areaOfInterest);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                setErrorMessage('Failed to load user preferences. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreaOfInterest();
    }, []);

    const toggleIssue = (issue) => {
        setSelectedIssues((prev) =>
            prev.includes(issue)
                ? prev.filter((i) => i !== issue)
                : [...prev, issue]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const response = await fetch('https://cyber-guidance.onrender.com/area-of-interest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ areaOfInterest: selectedIssues })
            });

            if (!response.ok) {
                throw new Error('Failed to update area of interest');
            }

            const data = await response.json();
            console.log(data.message);
            // You might want to show a success message to the user here
        } catch (error) {
            console.error('Error updating area of interest:', error);
            setErrorMessage('Failed to update area of interest. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <FaSpinner className="animate-spin text-blue-500 text-5xl" />
            </div>
        );
    }

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Personalization Settings</h2>
            <p className="text-gray-700 mb-4">Customize your user experience with these options:</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Existing personalization options */}
                <div>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Enable dark mode</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span>Show profile picture in header</span>
                    </label>
                </div>
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Preferred language</label>
                    <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option>English</option>
                        <option>French</option>
                        <option>Spanish</option>
                    </select>
                </div>

                {/* Area of Interest selection */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Areas of Interest</h3>
                    <p className="text-sm text-gray-600 mb-4">Select the topics you&apos;d like to focus on:</p>
                    <div className="flex flex-wrap gap-3">
                        {issues.map((issue) => (
                            <button
                                key={issue.name}
                                type="button"
                                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                                    selectedIssues.includes(issue.name)
                                        ? `${issue.color} text-white shadow-lg transform scale-105`
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                onClick={() => toggleIssue(issue.name)}
                            >
                                {issue.name}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <FaSpinner className="animate-spin mr-2" />
                        ) : null}
                        Save Personalization Settings
                    </button>
                </div>
            </form>
        </section>
    );
};

export default PersonalizationSettings;