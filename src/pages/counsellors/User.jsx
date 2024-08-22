import { useState } from 'react';
import PropTypes from 'prop-types';
import ProfileSection from '../../components/counselorsApp/ProfileSection';
import SecuritySettings from '../../components/counselorsApp/SecuritySettings';
import PersonalizationSettings from '../../components/counselorsApp/PersonalizationSettings';
import ProfileInfoSession from '../../components/counselorsApp/PersonalInfoSection';
function User() {
    const [activeTab, setActiveTab] = useState('security');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: User Profile and Personal Information */}
                <div className="col-span-1">
                    <ProfileSection />
                    <ProfileInfoSession />
                </div>

                {/* Right Column: Edit Form with Tabs */}
                <div className="col-span-1">
                    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                        {/* Tab Buttons */}
                        <div className="flex flex-wrap mb-6">
                            <TabButton label="Security" tabName="security" activeTab={activeTab} onClick={handleTabClick} />
                            <TabButton label="Personalization" tabName="personalization" activeTab={activeTab} onClick={handleTabClick} />
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'personalization' && <PersonalizationSettings />}
                    </section>
                </div>
            </div>
        </div>
    );
}

function TabButton({ label, tabName, activeTab, onClick }) {
    return (
        <button
            onClick={() => onClick(tabName)}
            className={`text-gray-600 py-2 px-4 rounded-lg mr-2 mb-2 focus:outline-none transition-colors duration-200 ${
                activeTab === tabName ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
            }`}
        >
            {label}
        </button>
    );
}

TabButton.propTypes = {
    label: PropTypes.string.isRequired,
    tabName: PropTypes.string.isRequired,
    activeTab: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default User;