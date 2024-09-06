import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaFlag } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import ReportModal from './ReportCounsellor';
import ConfirmReportModal from './ConfirmReportModal';
import { reportCounselor } from '../../axiosServices/reportApi';

const AppointmentCard = ({ appointment }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [message, setMessage] = useState('');

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason('');
  };

  const handleOpenConfirmModal = () => {
    setIsReportModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setReportReason('');
  };

  const handleSubmitReport = async () => {
    try {
      console.log("Submitting report with the following data:");
      console.log({
        appointmentId: appointment.id, // pass appointment id
        reportDetails: reportReason, // reason for the report
      });
  
      // Send only appointment ID and report details
      const response = await reportCounselor(appointment.id, {
        details: reportReason, // pass report details
      });
  
      console.log("Response from server:", response.data);
  
      if (response.status === 201 && response.data.message === 'Report submitted successfully.') {
        setMessage('Report submitted successfully');
      } else {
        setMessage('Failed to submit report');
      }
  
      handleCloseConfirmModal();
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage('Failed to submit report');
    }
  };
  

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300">
      <img 
        src={appointment.counselor.avatarUrl || 'https://picsum.photos/200'} 
        alt={appointment.counselor.fullName} 
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{appointment.counselor.fullName}</h3>
        <p className="text-sm text-gray-600">{moment(appointment.date).format('MMMM D, YYYY')}</p>
        <p className="text-sm text-gray-600">{moment(appointment.timeSlot, 'HH:mm').format('h:mm A')}</p>
        <p className="text-sm font-medium mt-2">Reason: {appointment.reason}</p>
        <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
          appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
          appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {appointment.status}
        </span>
      </div>
      <div>
        <button 
          onClick={handleOpenReportModal}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
          data-tip="Report Counselor"
        >
          <FaFlag />
        </button>
        <Tooltip place="top" type="dark" effect="solid" />
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          onSubmit={handleOpenConfirmModal}
          reportReason={reportReason}
          setReportReason={setReportReason}
        />
        <ConfirmReportModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleSubmitReport}
          counselorName={appointment.counselor.fullName}
          appointmentReason={appointment.reason}
          reportDetails={reportReason}
        />
      </div>
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default AppointmentCard;