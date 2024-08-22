import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { bookAppointmentWithACounselor } from '../../axiosServices/appointmentServices';
import { PropTypes } from 'prop-types';
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaCalendarAlt, FaClock, FaCommentAlt } from 'react-icons/fa';

const timeSlots = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '13:00-14:00', '14:00-15:00', '15:00-16:00'
];

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentBooked, counselorId, counselorName }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState('initial'); // 'initial', 'optimistic', 'success', 'error'
  const [error, setError] = useState(null);
  const [optimisticMessage, setOptimisticMessage] = useState('');

  useEffect(() => {
    if (bookingStatus === 'optimistic') {
      const messages = [
        'Contacting counselor...',
        'Scheduling your appointment...',
        'Preparing confirmation...',
        'Almost there...'
      ];
      let index = 0;
      const interval = setInterval(() => {
        setOptimisticMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [bookingStatus]);

  const handleBookAppointment = async () => {
    try {
      setBookingStatus('optimistic');
      setError(null);

      // Simulate a delay to show optimistic UI
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await bookAppointmentWithACounselor(counselorId, date, timeSlot, reason);
      console.log('Appointment booked successfully:', response);
      setBookingStatus('success');
      onAppointmentBooked();
      setTimeout(() => onClose(), 3000); // Close the modal after 3 seconds
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'An error occurred while booking the appointment. Please try again.');
      setBookingStatus('error');
    }
  };

  const resetForm = () => {
    setDate('');
    setTimeSlot('');
    setReason('');
    setBookingStatus('initial');
    setError(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Book an Appointment with {counselorName}
                </Dialog.Title>
                {bookingStatus === 'initial' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
                        Time Slot
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="text-gray-400" />
                        </div>
                        <select
                          id="timeSlot"
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a time slot</option>
                          {timeSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                          <FaCommentAlt className="text-gray-400" />
                        </div>
                        <textarea
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-24 resize-none"
                          placeholder="Please provide a brief description of the reason for your appointment"
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={handleBookAppointment}
                        disabled={!date || !timeSlot || !reason}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                )}
                {bookingStatus === 'optimistic' && (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-indigo-500 text-4xl mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">{optimisticMessage}</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we process your appointment...</p>
                  </div>
                )}
                {bookingStatus === 'success' && (
                  <div className="text-center py-8">
                    <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Appointment Booked Successfully!</h4>
                    <p className="text-sm text-gray-500">
                      An email has been sent with further instructions. The counselor will contact you soon.
                    </p>
                  </div>
                )}
                {bookingStatus === 'error' && (
                  <div className="text-center py-8">
                    <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Error Booking Appointment</h4>
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={resetForm}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

BookAppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAppointmentBooked: PropTypes.func.isRequired,
  counselorId: PropTypes.string.isRequired,
  counselorName: PropTypes.string.isRequired,
};

export default BookAppointmentModal;