import CountUp from 'react-countup';
import { FaUsers, FaCheckCircle, FaComments } from 'react-icons/fa';
import VisibilitySensor from 'react-visibility-sensor';
const Metrics = () => {
    const metrics = [
        { icon: <FaUsers className="text-gray-700 text-6xl" />, label: 'Clients Served', count: 1200 },
        { icon: <FaCheckCircle className="text-gray-700 text-6xl" />, label: 'Successful Counsels', count: 850 },
        { icon: <FaComments className="text-gray-700 text-6xl" />, label: 'Positive Testimonials', count: 1500 },
    ];

    return (
        <section className="py-16 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="w-full text-left lg:px-16">
                        <h2 className="text-xl font-bold text-gray-700 mb-6">Our Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {metrics.map((metric, index) => (
                        <div key={index} className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            {metric.icon}
                            <div>
                            <VisibilitySensor partialVisibility offset={{ bottom: 100 }}>
                            {({ isVisible }) => (
                                    <div>
                                        <CountUp end={isVisible ? metric.count : 0} duration={2.5} 
                                        className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4" 
                                        />
                                        <p  className="text-lg text-gray-600 mt-2">{metric.label}</p>
                                    </div>
                                )}
                            </VisibilitySensor>
                            </div>
                            {/* <CountUp start={0} end={metric.count} duration={2.5} className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4" />
                            <p className="text-lg text-gray-600 mt-2">{metric.label}</p> */}
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </section>
    );
};

export default Metrics;
