import PropTypes from 'prop-types';

function SecuritySettings() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Change Password</h3>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Current Password" id="currentPassword" type="password" />
                    <InputField label="New Password" id="newPassword" type="password" />
                    <div className="sm:col-span-2">
                        <SubmitButton label="Change Password" />
                    </div>
                </form>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">Change Secret PIN</h3>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Current PIN" id="currentPin" type="password" />
                    <InputField label="New PIN" id="newPin" type="password" />
                    <div className="sm:col-span-2">
                        <SubmitButton label="Change PIN" />
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500 mt-2">
                            Forgot your PIN? <a href="#" className="text-blue-500 hover:underline">Reset via Email</a>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}

function InputField({ label, id, type }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={id} name={id} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

function SubmitButton({ label }) {
    return (
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            {label}
        </button>
    );
}

SubmitButton.propTypes = {
    label: PropTypes.string.isRequired
};

export default SecuritySettings;