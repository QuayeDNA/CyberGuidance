import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Background from "../../components/Background"
const IssueSelectionPage = () => {
    const [selectedIssues, setSelectedIssues] = useState([]);
    const navigate = useNavigate();

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
        { name: 'Fatigue', color: 'bg-rose-400' },
        { name: 'Anger Management', color: 'bg-emerald-400' },
        { name: 'Career Choices', color: 'bg-violet-400' },
        { name: 'Bipolar Disorder', color: 'bg-amber-400' },
        { name: 'Concentration, memory and focus (ADHD)', color: 'bg-blue-500' },
        { name: 'Academic Stress', color: 'bg-green-500' },
        { name: 'Mental Health', color: 'bg-yellow-500' },
        { name: 'Career Guidance', color: 'bg-teal-500' },
        { name: 'Financial Guidance', color: 'bg-orange-500' },
        { name: 'Time Management', color: 'bg-red-500' },
        { name: 'Productivity', color: 'bg-purple-500' },
        { name: 'Goal Setting', color: 'bg-pink-500' },
        { name: 'Personal Development', color: 'bg-indigo-500' },
        { name: 'Exams Preparation', color: 'bg-cyan-500' },
        { name: 'Study Techniques', color: 'bg-lime-500' },
        { name: 'Social Anxiety', color: 'bg-fuchsia-500' },
    ];

    const toggleIssue = (issue) => {
        setSelectedIssues((prev) =>
            prev.includes(issue)
                ? prev.filter((i) => i !== issue)
                : [...prev, issue]
        );
    };

    const handleSubmit = () => {
        console.log(selectedIssues); // Handle the selected issues submission
        navigate ('/main/dashboard')
    };

    const handleSkip = () => {
        console.log('Skipped selection'); // Handle the skip action
        navigate ('/main/dashboard')
    };

    return (
        <Background>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-full mx-auto p-8 bg-white shadow-lg rounded-lg sm:max-w-screen-md animate-fadeIn">
                <h2 className="text-3xl font-bold mb-4 text-center">Select Your Areas of Interest</h2>
                <p className="text-lg mb-6 text-center">Please choose the topics you would like to focus on. This will help our system recommend the best Counselor for you:</p>
                <hr className='my-8 mx-12'/>
                <div className="flex flex-wrap gap-4">
                    {issues.map((issue) => (
                        <button
                            key={issue.name}
                            className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out ${
                                selectedIssues.includes(issue.name) ? `${issue.color} text-white` : 'bg-white text-gray-800 border'
                            } hover:shadow-md`}
                            onClick={() => toggleIssue(issue.name)}
                        >
                            {issue.name}
                        </button>
                    ))}
                </div>
                <hr className='my-8 mx-12'/>
                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
                        onClick={() => setSelectedIssues([])}
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                        onClick={handleSkip}
                    >
                        Skip
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
        </Background>
    );
};

export default IssueSelectionPage;
