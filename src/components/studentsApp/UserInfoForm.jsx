import PropTypes from 'prop-types';

function UserInfoForm() {
    return (
        <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Name" id="name" type="text" />
                <InputField label="ID Card Number" id="idCardNumber" type="text" />
                <InputField label="Year of Study" id="yearOfStudy" type="text" />
                <InputField label="Faculty" id="faculty" type="text" />
                <SelectField label="Religion" id="religion" options={["Christianity", "Islam", "Other"]} />
                <div className="flex items-center space-x-4">
                    <CheckboxField id="genderMale" label="Male" />
                    <CheckboxField id="genderFemale" label="Female" />
                </div>
                <InputField label="Age" id="age" type="text" />
                <InputField label="Programme" id="programme" type="text" />
                <InputField label="Department/Unit" id="department" type="text" />
                <InputField label="Hall of Residence/Hostel/Place of Abode" id="residence" type="text" />
                <div className="flex items-center space-x-4">
                    <CheckboxField id="single" label="Single" />
                    <CheckboxField id="married" label="Married" />
                </div>
                <InputField label="Telephone Number" id="telephoneNumber" type="text" />
                <div className="sm:col-span-2">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        Save Changes
                    </button>
                </div>
            </form>
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

function SelectField({ label, id, options }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={id} name={id} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
    options: PropTypes.array.isRequired
};

function CheckboxField({ id, label }) {
    return (
        <label className="flex items-center space-x-2">
            <input type="checkbox" id={id} name={id} className="form-checkbox h-5 w-5 text-blue-600" />
            <span>{label}</span>
        </label>
    );
}

CheckboxField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default UserInfoForm;