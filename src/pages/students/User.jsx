import { useState } from 'react';

function User() {
    const [activeTab, setActiveTab] = useState('user'); // State to track active tab

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: User Profile and Personal Information */}
            <div className="col-span-1">
                <section className="rounded-lg shadow-md p-6 mb-8 bg-white">
                    <h1 className="text-2xl font-bold mb-2">User Profile</h1>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
                            <img src="https://via.placeholder.com/150" alt="Profile Picture" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col mt-4 lg:mt-0">
                            <h2 className="text-xl font-bold">David Quaye</h2>
                            <p className="text-gray-700">Graphic Designer & Frontend Developer</p>
                            <p className="text-gray-700">Takoradi Technical University</p>
                            <p className="text-gray-700">Accra, Ghana</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                        <p className="text-gray-700"><span className="font-bold">Email:</span> david@example.com</p>
                        <p className="text-gray-700"><span className="font-bold">Phone:</span> +1234567890</p>
                        <p className="font-bold"><span className="font-bold">ID Number:</span> 1234567890</p>
                        <p className="text-gray-700"><span className="font-bold">Date of Birth:</span> January 1, 1990</p>
                        <p className="text-gray-700"><span className="font-bold">University:</span> Takoradi Technical University</p>
                        <p className="text-gray-700"><span className="font-bold">Program:</span> Computer Science</p>
                        <p className="text-gray-700"><span className="font-bold">Year of Study:</span> 4th Year</p>
                        <p className="text-gray-700"><span className="font-bold">Faculty :</span> Faculty of Applied Sciences</p>
                        <p className="text-gray-700"><span className="font-bold">Department:</span> Computer Science</p>
                        <p className="text-gray-700"><span className="font-bold">Gender:</span> Male</p>
                        <p className="text-gray-700"><span className="font-bold">Hall of Residence:</span>Nzima Mensah Hall</p>
                        <p className="text-gray-700"><span className="font-bold">City:</span> Takoradi</p>
                        <p className="text-gray-700"><span className="font-bold">State:</span> Takoradi</p>


                    </div>
                </section>
            </div>

            {/* Right Column: Edit Form with Tabs */}
            <div className="col-span-1">
                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    {/* Tab Buttons */}
                    <div className="flex mb-4">
                        <button
                            onClick={() => handleTabClick('user')}
                            className={`text-gray-600 py-2 px-4 rounded-lg mr-4 focus:outline-none ${activeTab === 'user' ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                            User Information
                        </button>
                        <button
                            onClick={() => handleTabClick('security')}
                            className={`text-gray-600 py-2 px-4 rounded-lg mr-4 focus:outline-none ${activeTab === 'security' ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => handleTabClick('personalization')}
                            className={`text-gray-600 py-2 px-4 rounded-lg focus:outline-none ${activeTab === 'personalization' ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                            Personalization
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'user' && (
                        <section className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                            <form className="grid grid-cols-1 sm:grid-cols-1 gap-4">

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="idCardNumber" className="block text-sm font-medium text-gray-700">ID Card Number</label>
                                    <input type="text" id="idCardNumber" name="idCardNumber" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700">Year of Study</label>
                                    <input type="text" id="yearOfStudy" name="yearOfStudy" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">Faculty</label>
                                    <input type="text" id="faculty" name="faculty" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Religion</label>
                                    <select id="religion" name="religion" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Select Religion</option>
                                        <option value="Christianity">Christianity</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" id="genderMale" name="genderMale" className="form-checkbox h-5 w-5 text-blue-600" />
                                        <span>Male</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" id="genderFemale" name="genderFemale" className="form-checkbox h-5 w-5 text-blue-600" />
                                        <span>Female</span>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                    <input type="text" id="age" name="age" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="programme" className="block text-sm font-medium text-gray-700">Programme</label>
                                    <input type="text" id="programme" name="programme" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department/Unit</label>
                                    <input type="text" id="department" name="department" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="residence" className="block text-sm font-medium text-gray-700">Hall of Residence/Hostel/Place of Abode</label>
                                    <input type="text" id="residence" name="residence" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" id="single" name="single" className="form-checkbox h-5 w-5 text-blue-600" />
                                        <span>Single</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" id="married" name="married" className="form-checkbox h-5 w-5 text-blue-600" />
                                        <span>Married</span>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="telephoneNumber" className="block text-sm font-medium text-gray-700">Telephone Number</label>
                                    <input type="text" id="telephoneNumber" name="telephoneNumber" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div className="sm:col-span-2">
                                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                    {activeTab === 'security' && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-2">Change Password</h3>
                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <input type="password" id="currentPassword" name="currentPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input type="password" id="newPassword" name="newPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Change Secret PIN</h3>
                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="currentPin" className="block text-sm font-medium text-gray-700">Current PIN</label>
                                        <input type="password" id="currentPin" name="currentPin" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="newPin" className="block text-sm font-medium text-gray-700">New PIN</label>
                                        <input type="password" id="newPin" name="newPin" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Change PIN
                                        </button>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-gray-500 mt-2">Forgot your PIN? <a href="#" className="text-blue-500 hover:underline">Reset via Email</a></p>
                                    </div>
                                </form>
                            </div>
                        </section>

                    )}
                    {activeTab === 'personalization' && (
                        <div>
                            {/* Personalization Tab Content */}
                            <p className="text-gray-700">Personalization options go here.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default User;
