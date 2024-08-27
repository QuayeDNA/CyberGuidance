import { useState, Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaPhone,
} from "react-icons/fa";
import PropTypes from "prop-types";

const EmergencyBookingButton = ({ counselorId, counselorName, isOpen, onClose, onBookingInitiated }) => {
  const [bookingStatus, setBookingStatus] = useState("initial");
  const [error, setError] = useState(null);

  const handleEmergencyBooking = async () => {
    try {
      setBookingStatus("processing");
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // If successful:
      setBookingStatus("success");
    } catch (err) {
      console.error("Error booking emergency appointment:", err);
      setError(
        "An error occurred. Please try again or call our emergency number."
      );
      setBookingStatus("error");
    }
  };

  const closeModal = () => {
    onClose();
    setBookingStatus("initial");
    setError(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900 mb-4">
                  Emergency Booking for {counselorName}
                </DialogTitle>
                {bookingStatus === "initial" && (
                  <div className="text-center py-8">
                    <p className="text-lg font-medium text-gray-900 mb-4">
                      Are you sure you want to request an emergency session with {counselorName}?
                    </p>
                    <button
                      onClick={handleEmergencyBooking}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mr-4">
                      Confirm Emergency Booking
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                      Cancel
                    </button>
                  </div>
                )}
                {bookingStatus === "processing" && (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-red-500 text-4xl mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">
                      Processing Your Emergency Request
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Please hold on, we&apos;re contacting {counselorName} right away...
                    </p>
                  </div>
                )}
                {bookingStatus === "success" && (
                  <div className="text-center py-8">
                    <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Emergency Request Received
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      {counselorName} has been notified and will contact you
                      immediately. Please stay where you are if it&apos;s safe
                      to do so.
                    </p>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                      <p className="font-bold">While you wait:</p>
                      <p>
                        Visit the nearest counseling office at: [Office
                        Location]
                      </p>
                      <p className="mt-2">
                        <FaPhone className="inline mr-2" />
                        Emergency Helpline:{" "}
                        <a
                          href="tel:1234567890"
                          className="font-bold hover:underline">
                          123-456-7890
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {bookingStatus === "error" && (
                  <div className="text-center py-8">
                    <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Error Processing Request
                    </h4>
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleEmergencyBooking}>
                      Try Again
                    </button>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}>
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

EmergencyBookingButton.propTypes = {
  counselorId: PropTypes.string.isRequired,
  counselorName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBookingInitiated: PropTypes.func.isRequired,
};

export default EmergencyBookingButton;