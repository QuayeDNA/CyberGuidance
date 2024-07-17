import CountUp from 'react-countup';
import { FaUsers, FaCheckCircle, FaComments } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const Metrics = () => {
    const metrics = [
        { icon: <FaUsers className="text-gray-700 text-6xl" />, label: 'Clients Served', count: 1200 },
        { icon: <FaCheckCircle className="text-gray-700 text-6xl" />, label: 'Successful Counsels', count: 850 },
        { icon: <FaComments className="text-gray-700 text-6xl" />, label: 'Positive Testimonials', count: 1500 },
    ];

    // Create refs and inView states for each metric
    const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="w-full text-left lg:px-16">
                    <h2 className="text-xl font-bold text-gray-700 mb-6">Our Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div ref={ref1} className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            {metrics[0].icon}
                            <div>
                                <CountUp
                                    end={inView1 ? metrics[0].count : 0}
                                    duration={2.5}
                                    className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4"
                                />
                                <p className="text-lg text-gray-600 mt-2">{metrics[0].label}</p>
                            </div>
                        </div>
                        <div ref={ref2} className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            {metrics[1].icon}
                            <div>
                                <CountUp
                                    end={inView2 ? metrics[1].count : 0}
                                    duration={2.5}
                                    className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4"
                                />
                                <p className="text-lg text-gray-600 mt-2">{metrics[1].label}</p>
                            </div>
                        </div>
                        <div ref={ref3} className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            {metrics[2].icon}
                            <div>
                                <CountUp
                                    end={inView3 ? metrics[2].count : 0}
                                    duration={2.5}
                                    className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4"
                                />
                                <p className="text-lg text-gray-600 mt-2">{metrics[2].label}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics;
