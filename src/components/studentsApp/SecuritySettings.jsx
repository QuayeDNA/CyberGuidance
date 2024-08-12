import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function SecuritySettings() {
    const [isPinSet, setIsPinSet] = useState(false);
    const [isChangingPin, setIsChangingPin] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const userPin = localStorage.getItem('userPin');
        setIsPinSet(!!userPin);
    }, []);

    const handlePinChange = (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        const oldPin = event.target.oldPin?.value;
        const newPin = event.target.newPin.value;

        if (isPinSet) {
            const storedPin = localStorage.getItem('userPin');
            if (oldPin !== storedPin) {
                setError('Incorrect PIN');
                return;
            }
        }

        localStorage.setItem('userPin', newPin);
        setIsPinSet(true);
        setIsChangingPin(false);
        setSuccessMessage('PIN successfully ' + (isPinSet ? 'changed' : 'set'));
    };

    const handleForgotPin = () => {
        // Here you would trigger the "Reset via Email" process
        // For now, we'll just log a message
        console.log("Trigger reset PIN via email process");
    };

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
                <h3 className="text-xl font-bold mb-2">
                    {isPinSet ? 'Change Secret PIN' : 'Set Secret PIN'}
                </h3>
                {!isChangingPin && isPinSet ? (
                    <div>
                        <button
                            onClick={() => setIsChangingPin(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                            Change PIN
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePinChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isPinSet && (
                            <InputField label="Current PIN" id="oldPin" type="password" />
                        )}
                        <InputField label="New PIN" id="newPin" type="password" />
                        <div className="sm:col-span-2">
                            <SubmitButton label={isPinSet ? "Change PIN" : "Set PIN"} />
                        </div>
                    </form>
                )}
                {error && <div className="mt-2 text-red-500">{error}</div>}
                {successMessage && <div className="mt-2 text-green-500">{successMessage}</div>}
                {isPinSet && (
                    <div className="mt-2">
                        <button
                            onClick={handleForgotPin}
                            className="text-blue-500 hover:underline"
                        >
                            Forgot your PIN? Reset via Email
                        </button>
                    </div>
                )}
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