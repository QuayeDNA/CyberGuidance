function PersonalInfoSection() {
    const personalInfo = [
        { label: "Email", value: "david@example.com" },
        { label: "Phone", value: "+1234567890" },
        { label: "ID Number", value: "1234567890" },
        { label: "Date of Birth", value: "January 1, 1990" },
        { label: "University", value: "Takoradi Technical University" },
        { label: "Program", value: "Computer Science" },
        { label: "Year of Study", value: "4th Year" },
        { label: "Faculty", value: "Faculty of Applied Sciences" },
        { label: "Department", value: "Computer Science" },
        { label: "Gender", value: "Male" },
        { label: "Hall of Residence", value: "Nzima Mensah Hall" },
        { label: "City", value: "Takoradi" },
        { label: "State", value: "Takoradi" },
    ];

    return (
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalInfo.map((item, index) => (
                    <p key={index} className="text-gray-700">
                        <span className="font-bold">{item.label}:</span> {item.value}
                    </p>
                ))}
            </div>
        </section>
    );
}

export default PersonalInfoSection;