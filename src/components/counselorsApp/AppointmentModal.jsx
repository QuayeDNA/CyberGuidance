// AppointmentModal.jsx
import { Fragment } from 'react';
import { Dialog, Transition, DialogTitle, TransitionChild, DialogPanel } from '@headlessui/react';
import moment from 'moment';
import PropTypes from 'prop-types';

const AppointmentModal = ({ isOpen, onClose, appointment }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
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
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Appointment Details
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Created on: {moment(appointment?.date).format('Do MMMM YYYY [at] h:mm A')}
                  </p>
                  <p className="text-sm text-gray-500">Time Slot: {appointment?.timeSlot}</p>
                  <p className="text-sm text-gray-500">Reason: {appointment?.reason}</p>
                  <p
                    className={`text-sm font-bold ${
                      appointment?.status === 'pending'
                        ? 'text-yellow-500'
                        : appointment?.status === 'cancelled'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    Status: {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-bold">Student:</p>
                    <p className="text-sm text-gray-500">Name: {appointment?.student?.fullName}</p>
                    <p className="text-sm text-gray-500">Email: {appointment?.student?.email}</p>
                    <p className="text-sm text-gray-500">Phone: {appointment?.student?.mobileNumber}</p>
                  </div>
                  {appointment?.counselor && (
                    <div className="mt-4">
                      <p className="text-sm font-bold">Counselor:</p>
                      <p className="text-sm text-gray-500">Name: {appointment?.counselor?.fullName}</p>
                      <p className="text-sm text-gray-500">Email: {appointment?.counselor?.email}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
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

AppointmentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    appointment: PropTypes.object.isRequired,
    };

export default AppointmentModal;