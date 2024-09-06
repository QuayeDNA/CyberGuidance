import { useState, useEffect, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { reassignCounselor } from '../../../axiosServices/reportApi';

const ReassignModal = ({ isOpen, closeModal, report, onReassign, isLoading }) => {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://cyber-guidance.onrender.com/api/all-counselors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCounselors(response.data.counselors);
      } catch (error) {
        console.error('Error fetching counselors:', error);
        setError('Failed to fetch counselors. Please try again later.');
      }
    };

    fetchCounselors();
  }, []);

  const handleReassign = async () => {
    if (selectedCounselor) {
      if (report?.appointment?.id) {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        console.log('Reassigning counselor:', {
          appointmentId: report.appointment.id,
          newCounselorId: selectedCounselor
        });
        try {
          await reassignCounselor(report.appointment.id, selectedCounselor);
          setSuccessMessage('Counselor reassigned successfully.');
          onReassign(report.appointment.id, selectedCounselor);
          closeModal();
        } catch (err) {
          console.error('Error reassigning counselor:', err);
          setError(err.message || 'An error occurred while reassigning the counselor.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid report data. Please try again.');
      }
    } else {
      setError('Please select a counselor to reassign the report.');
    }
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
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Reassign Report
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to reassign this report?
                  </p>
                </div>

                <div className="mt-4">
                  <label htmlFor="counselor" className="block text-sm font-medium text-gray-700">
                    Select Counselor
                  </label>
                  <select
                    id="counselor"
                    name="counselor"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    disabled={loading || isLoading}
                  >
                    <option value="">Select a counselor</option>
                    {counselors.map((counselor) => (
                      <option key={counselor._id} value={counselor._id}>
                        {counselor.username}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="mt-4 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mt-4 text-green-500 text-sm">
                    {successMessage}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                    onClick={handleReassign}
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Reassign
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
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

ReassignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  onReassign: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ReassignModal;