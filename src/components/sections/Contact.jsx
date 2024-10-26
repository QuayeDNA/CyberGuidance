import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaClock, FaBuilding } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);  // Success or error message

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!name || !email || !message) {
            setStatus({ success: false, message: 'Please fill in all fields.' });
            return;
        }

        try {
            // Send the form data to the backend
            const response = await axios.post('https://cyber-guidance.onrender.com/api/contact', { name, email, message });
            setStatus({ success: true, message: response.data.message });
        } catch (error) {
            setStatus({ success: false, message: 'Failed to send message. Please try again later.' });
        }
    };

    return (
        <section id="contact" className="py-16 bg-gray-700">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="w-full text-left lg:px-16">
                    <h2 className="text-xl font-bold text-white mb-6">Get In Touch</h2>
                    <p className="text-center mb-12 text-lg lg:text-xl text-white">We&apos;d love to hear from you. Reach out to us through any of the following ways:</p>
                    <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start space-x-4">
                        {/* Contact Information */}
                        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 space-y-8">
                            {/* Contact Items */}
                            <div className="flex items-center overflow-hidden">
                                <div className="bg-gray-700 p-6 mr-2 rounded-l-lg border">
                                    <FaPhoneAlt className="text-4xl text-white" />
                                </div>
                                <div className="px-4 py-2 bg-white border-2 border-white rounded-r-lg text-gray-700 w-full">
                                    <h3 className="text-xl font-bold mb-2">Call Us</h3>
                                    <p className="text-md lg:text-lg">+123 456 7890</p>
                                </div>
                            </div>
                            {/* Other Contact Details */}
                            <div className="flex items-center overflow-hidden">
                                <div className="bg-gray-700 p-6 mr-2 rounded-l-lg border">
                                    <FaMapMarkerAlt className="text-4xl text-white" />
                                </div>
                                <div className="px-4 py-2 bg-white border-2 border-white rounded-r-lg text-gray-700 w-full">
                                    <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                                    <p className="text-md lg:text-lg">Campus Location, TTU</p>
                                </div>
                            </div>
                            {/* Continue with additional contact details as per your original component */}
                        </div>

                        {/* Contact Form */}
                        <div className="w-full lg:w-1/2 border border-white p-8 rounded-lg text-white">
                            {status && (
                                <p className={`text-center font-semibold ${status.success ? 'text-green-500' : 'text-red-500'}`}>
                                    {status.message}
                                </p>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-md lg:text-lg font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 text-gray-700"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md lg:text-lg font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 text-gray-700"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md lg:text-lg font-bold mb-2">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-3 py-2 text-gray-700 h-32"
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-white text-gray-700 px-6 py-2 rounded-lg font-semibold shadow-md transition duration-300">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
