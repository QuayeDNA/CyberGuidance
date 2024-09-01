import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaFlag } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip'
import ReportModal from './ReportCounsellor';
import ConfirmReportModal from './ConfirmReportModal';

const AppointmentCard = ({ appointment, studentId }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

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
      const response = await fetch('https://your-api-endpoint.com/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers
        },
        body: JSON.stringify({
          studentId,
          counselorId: appointment.counselor.id,
          appointmentReason: appointment.reason,
          reportDetails: reportReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      // Handle successful submission
      console.log('Report submitted successfully');
      handleCloseConfirmModal();
    } catch (error) {
      console.error('Error submitting report:', error);
      // Handle error (e.g., show error message to user)
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
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  studentId: PropTypes.string.isRequired,
};

export default AppointmentCard;