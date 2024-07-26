import { useState } from 'react';
import { BiChat, BiNote } from 'react-icons/bi'; // Importing icons from react-icons
import Chats from '../../components/studentsApp/Chats';
import "../../components/css/Messaging.css";
const MessagingComponent = () => {
    const [activeTab, setActiveTab] = useState('chats'); // Default tab is 'chats'

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-start items-center mb-2">
                <button
                    onClick={() => handleTabClick('chats')}
                    className={`flex items-center justify-center px-4 py-2 mr-2 rounded-full cursor-pointer ${
                        activeTab === 'chats' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <BiChat className="h-5 w-5 md:mr-2" />
                    <span className="hidden sm:inline">Chats</span>
                </button>
                <button
                    onClick={() => handleTabClick('notes')}
                    className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer ${
                        activeTab === 'notes' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <BiNote className="h-5 w-5 md:mr-2" />
                    <span className="hidden sm:inline">Notes</span>
                </button>
            </div>
            <div>
                {/* Content for chats tab */}
                {activeTab === 'chats' && (
                    <div>
                        {/* Placeholder content for chats */}
                        <Chats />
                    </div>
                )}
                {/* Content for notes tab */}
                {activeTab === 'notes' && (
                    <div>
                        {/* Placeholder content for notes */}
                        <p>Notes content goes here...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingComponent;
