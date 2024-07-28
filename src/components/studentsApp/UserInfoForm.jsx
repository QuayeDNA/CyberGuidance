import PropTypes from 'prop-types';

function UserInfoForm() {
    return (
        <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p className="font-bold">Note:</p>
                <p>Your personal information cannot be changed here. If you need to update any details, please contact the admin.</p>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Name" id="name" type="text" disabled />
                <InputField label="ID Card Number" id="idCardNumber" type="text" disabled />
                <InputField label="Year of Study" id="yearOfStudy" type="text" disabled />
                <InputField label="Faculty" id="faculty" type="text" disabled />
                <SelectField label="Religion" id="religion" options={["Christianity", "Islam", "Other"]} disabled />
                <div className="flex items-center space-x-4">
                    <CheckboxField id="genderMale" label="Male" disabled />
                    <CheckboxField id="genderFemale" label="Female" disabled />
                </div>
                <InputField label="Age" id="age" type="text" disabled />
                <InputField label="Programme" id="programme" type="text" disabled />
                <InputField label="Department/Unit" id="department" type="text" disabled />
                <InputField label="Hall of Residence/Hostel/Place of Abode" id="residence" type="text" disabled />
                <div className="flex items-center space-x-4">
                    <CheckboxField id="single" label="Single" disabled />
                    <CheckboxField id="married" label="Married" disabled />
                </div>
                <InputField label="Telephone Number" id="telephoneNumber" type="text" disabled />
            </form>
        </section>
    );
}

function InputField({ label, id, type, disabled }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input 
                type={type} 
                id={id} 
                name={id} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed" 
                disabled={disabled}
            />
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

function SelectField({ label, id, options, disabled }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select 
                id={id} 
                name={id} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed"
                disabled={disabled}
            >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool
};

function CheckboxField({ id, label, disabled }) {
    return (
        <label className="flex items-center space-x-2">
            <input 
                type="checkbox" 
                id={id} 
                name={id} 
                className="form-checkbox h-5 w-5 text-blue-600 cursor-not-allowed" 
                disabled={disabled}
            />
            <span className="text-gray-700">{label}</span>
        </label>
    );
}

CheckboxField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default UserInfoForm;