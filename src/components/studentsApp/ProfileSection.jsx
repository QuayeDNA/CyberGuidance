function ProfileSection() {
    return (
        <section className="rounded-lg shadow-md p-6 mb-8 bg-white">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
                    <img src="https://via.placeholder.com/150" alt="Profile Picture" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">David Quaye</h2>
                    <p className="text-gray-700">Graphic Designer & Frontend Developer</p>
                    <p className="text-gray-700">Takoradi Technical University</p>
                    <p className="text-gray-700">Accra, Ghana</p>
                </div>
            </div>
        </section>
    );
}

export default ProfileSection;