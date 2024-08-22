import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { bookAppointmentWithACounselor } from '../../axiosServices/appointmentServices';
import { PropTypes } from 'prop-types';
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const timeSlots = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00'
];

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentBooked, counselorId }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('initial'); // 'initial', 'processing', 'success', 'error'

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      setError(null);
      setBookingStatus('processing');

      console.log('Booking appointment:', { counselorId, date, timeSlot, reason });

      const response = await bookAppointmentWithACounselor(counselorId, date, timeSlot, reason);
      console.log('Appointment booked successfully:', response);
      setBookingStatus('success');
      onAppointmentBooked(); // Call the callback function
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.message);
      setBookingStatus('error');
    } finally {
      setLoading(false);
    }
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
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Book an Appointment
                </Dialog.Title>
                <div className="mt-2">
                  <div className="mb-4">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="timeSlot"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time Slot
                    </label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-24 resize-none p-2"
                      placeholder="Please provide a brief description of the reason for your appointment"
                    ></textarea>
                  </div>
                  {error && (
                    <div className="text-red-500 mb-4 flex items-center">
                      <FaExclamationCircle className="mr-2" />
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  {bookingStatus === 'initial' && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={handleBookAppointment}
                      disabled={loading || !date || !timeSlot || !reason}
                    >
                      {loading ? 'Processing...' : 'Book Appointment'}
                    </button>
                  )}
                  {bookingStatus === 'processing' && (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin text-indigo-500 mr-2" />
                      <span>Booking appointment...</span>
                    </div>
                  )}
                  {bookingStatus === 'success' && (
                    <div className="flex items-center justify-center text-green-500">
                      <FaCheckCircle className="mr-2" />
                      <span>Appointment booked successfully! The counselor has been notified.</span>
                    </div>
                  )}
                  {bookingStatus === 'error' && (
                    <div className="flex items-center justify-center text-red-500">
                      <FaExclamationCircle className="mr-2" />
                      <span>Error booking appointment</span>
                    </div>
                  )}
                </div>
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
};

export default BookAppointmentModal;