const About = () => {
    const missionValues = [
        {
            title: 'Compassion',
            description: 'We approach every individual with empathy and compassion, fostering a safe and supportive environment.',
            image: 'https://picsum.photos/500', // Replace with actual URL
        },
        {
            title: 'Professionalism',
            description: 'Our counselors adhere to the highest standards of professionalism, ensuring quality care and guidance.',
            image: 'https://picsum.photos/500', // Replace with actual URL
        },
        {
            title: 'Personalization',
            description: 'We tailor our counseling approach to meet your unique needs, providing personalized solutions and support.',
            image: 'https://picsum.photos/500', // Replace with actual URL
        },
        {
            title: 'Support',
            description: 'We are here to support students and staff through any challenges, offering a listening ear and expert advice.',
            image: 'https://picsum.photos/500' // Replace with actual URL
        }
    ];

    return (
        <main>
            <section id="about" className="py-16 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="w-full text-left lg:px-16">
                        <h2 className="text-xl font-bold text-gray-700 mb-6">About CyberGuidance</h2>
                        <p className="text-2xl font-bold my-4 text-justified leading">
                            CyberGuidance is a professional counseling service dedicated to helping TTU students and staff navigate life&apos;s challenges.
                        </p>
                        <p className="text-xl text-gray-700 leading-relaxed mb-6 text-justify">
                            At CyberGuidance, we are committed to helping you overcome life&apos;s challenges through professional counseling services. Our mission is to provide compassionate and personalized guidance to support your mental health and well-being. Our team of experienced counselors is dedicated to providing compassionate and personalized guidance.
                        </p>
                        <a
                            href="/learn-more"
                            className="bg-transparent hover:bg-gray-700 text-gray-700 hover:text-white border border-gray-700 px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 inline-block"
                        >
                            Learn More
                        </a>
                    </div>

                    {/* Mission and Values Cards */}
                    <div className="container mx-auto px-4 lg:px-8 mt-16">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 text-left">Our Mission and Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {missionValues.map((value, index) => (
                                <div key={index} className="bg-white rounded-lg overflow-hidden">
                                    <img src={value.image} alt={value.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                                        <p className="text-gray-700 leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
