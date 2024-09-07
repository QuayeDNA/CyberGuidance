import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaFlag } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import ReportModal from '../studentsApp/ReportCounsellor';

const AppointmentCard = ({ appointment }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => setIsReportModalOpen(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300">
      <img 
        src={appointment.counselor.profilePicture || 'https://picsum.photos/200'} 
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
          appointmentId={appointment.id}
          counselorName={appointment.counselor.fullName}
          appointmentReason={appointment.reason}
        />
      </div>
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default AppointmentCard;