// SessionDetailsModal.js
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import PropTypes from 'prop-types';

const SessionDetailsModal = ({ isOpen, onClose, sessionData }) => {
  if (!sessionData) return null;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
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
              as={React.Fragment}
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
                  Session Details
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Date: {moment(sessionData.date).format('MMMM D, YYYY')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time: {sessionData.timeSlot}
                  </p>
                  <p className="text-sm text-gray-500">
                    Student: {sessionData.student.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Counselor: {sessionData.counselor.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Notes: {sessionData.notes}
                  </p>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

SessionDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sessionData: PropTypes.object,
    };

export default SessionDetailsModal;