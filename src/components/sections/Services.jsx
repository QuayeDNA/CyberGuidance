import { FaHandsHelping, FaUserTie, FaBrain, FaLifeRing } from 'react-icons/fa';

const Services = () => {
    const services = [
        {
            title: 'Academic Counseling',
            description: 'Helping students navigate academic challenges and achieve their educational goals.',
            icon: <FaHandsHelping className="text-gray-700 text-6xl" />
        },
        {
            title: 'Career Guidance',
            description: 'Providing career advice and support to help students plan their future careers.',
            icon: <FaUserTie className="text-gray-700 text-6xl" />
        },
        {
            title: 'Personal Development',
            description: 'Supporting students in their personal growth and development journey.',
            icon: <FaBrain className="text-gray-700 text-6xl" />
        },
        {
            title: 'Mental Health Support',
            description: 'Offering mental health services to support students\' well-being.',
            icon: <FaLifeRing className="text-gray-700 text-6xl" />
        }
    ];

    return (
        <main>
            {/* Services Section */}
            <section id="services" className="py-16 bg-gray-700 shadow-xl">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="w-full text-left lg:px-16">
                        <h2 className="text-xl font-bold text-white mb-6">Our Services</h2>
                    <p className="text-xl text-white mb-8 text-center">We offer a range of services to support students in their academic, personal, and career development.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 text-center flex flex-col items-center shadow-lg">
                                <div className="mb-4 flex items-center justify-center">{service.icon}</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">{service.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </section>
        </main>
    );
};

export default Services;
