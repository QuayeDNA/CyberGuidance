import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { reportCounselor } from '../../axiosServices/reportApi';

const ReportModal = ({
  isOpen,
  onClose,
  appointmentId,
  counselorName,
}) => {
  const [reportReason, setReportReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      const response = await reportCounselor(appointmentId, { details: reportReason });
      setResponseMessage(response.message || 'Report submitted successfully.');
    } catch (error) {
      setResponseMessage(error.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleBack = () => {
    setIsConfirmed(false);
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
                  Report Counselor
                </Dialog.Title>
                {!isConfirmed ? (
                  <>
                    <div className="mt-2">
                      <textarea
                        className="w-full h-32 p-2 border rounded mb-4"
                        placeholder="Please provide details about your concern..."
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      ></textarea>
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
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleConfirm}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 text-sm text-gray-500">
                      Are you sure you want to report <strong>{counselorName}</strong> for the following reason: <em>&quot;{reportReason}&quot;</em>?
                      <p className="text-red-500 mt-3">This report will be taken seriously</p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                    {responseMessage && (
                      <div className={`mt-2 text-sm ${responseMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                        {responseMessage}
                      </div>
                    )}
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={handleBack}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleSubmitReport}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

ReportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointmentId: PropTypes.string.isRequired,
  counselorName: PropTypes.string.isRequired,
  appointmentReason: PropTypes.string.isRequired,
};

export default ReportModal;