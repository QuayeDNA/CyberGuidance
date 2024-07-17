function PersonalizationSettings() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Personalization Settings</h2>
            <p className="text-gray-700 mb-4">Customize your user experience with these options:</p>
            <form className="space-y-4">
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
                    <label htmlFor="language"  className="block text-sm font-medium text-gray-700 mb-1">Preferred language</label>
                    <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option>English</option>
                        <option>French</option>
                        <option>Spanish</option>
                    </select>
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        Save Personalization Settings
                    </button>
                </div>
            </form>
        </section>
    );
}

export default PersonalizationSettings;