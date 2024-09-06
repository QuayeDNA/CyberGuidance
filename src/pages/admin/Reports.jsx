import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { getAllReports, markReportUnderReview, resolveReport } from '../../axiosServices/reportApi';
import ReassignModal from './components/ReassignModal';

const ReportActionModal = ({ isOpen, closeModal, report, onAction, isLoading }) => (
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
                Take Action on Report
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  What action would you like to take for this report?
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={() => onAction(report.reportId, 'underReview')}
                  disabled={isLoading}
                >
                  {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  Mark as Under Review
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  onClick={() => onAction(report.reportId, 'resolved')}
                  disabled={isLoading}
                >
                  {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  Mark as Resolved
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

ReportActionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reassignLoading, setReassignLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllReports();
      setReports(data.reports);
    } catch (err) {
      setError('An error occurred while fetching reports. Please try again later.');
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    setActionLoading(true);
    try {
      let response;
      if (action === 'underReview') {
        response = await markReportUnderReview(reportId, 'Marked as under review');
      } else if (action === 'resolved') {
        response = await resolveReport(reportId, 'Marked as resolved');
      }

      if (!response) {
        throw new Error('Failed to perform action');
      }

      setSuccessMessage(`Report ${action === 'underReview' ? 'marked as under review' : 'resolved'} successfully`);
      setIsModalOpen(false);
      fetchReports(); // Refresh the reports list
    } catch (err) {
      setError(`An error occurred while performing the action. Please try again.`);
      console.error('Error performing action:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Reports Dashboard</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <FaCheckCircle className='h-6 w-6' />
          </span>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li key={report.reportId}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    Report #{report.reportId}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'underReview' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <FaExclamationCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      {report.appointmentReason}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Reported on {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Take Action
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsReassignModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    disabled={report.status === 'resolved'}
                  >
                    Reassign
                  </button>
                </div>
              </div>
            </div>
            </li>
          ))}
        </ul>
      </div>

      <ReportActionModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        report={selectedReport}
        onAction={handleAction}
        isLoading={actionLoading}
      />

      <ReassignModal
        isOpen={isReassignModalOpen}
        closeModal={() => setIsReassignModalOpen(false)}
        report={selectedReport}
        isLoading={reassignLoading}
        onReassign={(appointmentId, counselorId) => {
          console.log(`Reassigned appointment ${appointmentId} to counselor ${counselorId}`);
          setReassignLoading(false);
          fetchReports(); // Refresh the reports list
        }}
      />
    </div>
  );
};

export default AdminReportsPage;