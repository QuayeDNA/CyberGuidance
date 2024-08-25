import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { FaSpinner, FaEdit, FaTimes, FaCheck, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";

const API_BASE_URL = "https://cyber-guidance.onrender.com";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchAppointmentHistory();
  }, []);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointment-history`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).token}`,
        },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      setError("Error fetching appointment history.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);

    switch (action) {
      case "reschedule":
        setModalContent(
          <RescheduleForm
            appointment={appointment}
            onSubmit={handleRescheduleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case "cancel":
        setModalContent(
          <ConfirmationDialog
            message="Are you sure you want to cancel this appointment?"
            onConfirm={() => handleCancelConfirm(appointment)}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case "complete":
        setModalContent(
          <ConfirmationDialog
            message="Mark this appointment as completed?"
            onConfirm={() => handleCompleteConfirm(appointment)}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case "view":
        await handleViewSessionData(appointment);
        break;
      default:
        setIsModalOpen(false);
    }
  };

  const handleRescheduleSubmit = async (newDate, newTimeSlot) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/reschedule-appointment`,
        {
          appointmentId: selectedAppointment.id,
          newDate,
          newTimeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment(response.data.appointment);
      setIsModalOpen(false);
    } catch (error) {
      alert("Error rescheduling appointment. Please try again.");
    }
  };

  const handleCancelConfirm = async (appointment) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/cancel-appointment`,
        { appointmentId: appointment.id },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment({ ...appointment, status: "cancelled" });
      setIsModalOpen(false);
    } catch (error) {
      alert("Error canceling appointment. Please try again.");
    }
  };

  const handleCompleteConfirm = async (appointment) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/complete-appointment`,
        { appointmentId: appointment.id },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment({ ...appointment, status: "completed" });
      setIsModalOpen(false);
    } catch (error) {
      alert("Error marking appointment as completed. Please try again.");
    }
  };

  const handleViewSessionData = async (appointment) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/session-details/${appointment.id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")).token}`,
        },
      });
      setModalContent(<SessionDetails sessionData={response.data} onClose={() => setIsModalOpen(false)} />);
    } catch (error) {
      alert("Error fetching session details. Please try again.");
    }
  };

  const updateAppointment = (updatedAppointment) => {
    setAppointments(
      appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Appointment History</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

const AppointmentCard = ({ appointment, onAction }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-semibold">{appointment.reason}</p>
          <p className="text-sm text-gray-600">
            {moment(appointment.date).format("MMMM D, YYYY")} at {appointment.timeSlot}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            statusColors[appointment.status]
          }`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <ActionButton
          icon={<FaEdit />}
          label="Reschedule"
          onClick={() => onAction("reschedule", appointment)}
          color="blue"
        />
        <ActionButton
          icon={<FaTimes />}
          label="Cancel"
          onClick={() => onAction("cancel", appointment)}
          color="red"
        />
        <ActionButton
          icon={<FaCheck />}
          label="Complete"
          onClick={() => onAction("complete", appointment)}
          color="green"
        />
        <ActionButton
          icon={<FaEye />}
          label="View Details"
          onClick={() => onAction("view", appointment)}
          color="gray"
        />
      </div>
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
};

const ActionButton = ({ icon, label, onClick, color }) => {
  const baseClasses = "flex items-center space-x-1 px-3 py-1 rounded-md text-white text-sm transition-colors duration-200";
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf(["blue", "red", "green", "gray"]),
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {children}
        <button
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

const RescheduleForm = ({ appointment, onSubmit, onCancel }) => {
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newDate, newTimeSlot);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newDate">
          New Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="newDate"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newTimeSlot">
          New Time Slot
        </label>
              <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="newTimeSlot"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
          required
        >
          <option value="10:00-11:00">10:00-11:00</option>
          <option value="11:00-12:00">11:00-12:00</option>
          <option value="12:00-13:00">12:00-13:00</option>
          <option value="13:00-14:00">13:00-14:00</option>
          <option value="14:00-15:00">14:00-15:00</option>
          <option value="15:00-16:00">15:00-16:00</option>
          <option value="16:00-17:00">16:00-17:00</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

RescheduleForm.propTypes = {
  appointment: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p className="text-lg mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const SessionDetails = ({ sessionData, onClose }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Session Details</h3>
      <p><strong>Date:</strong> {moment(sessionData.date).format("MMMM D, YYYY")}</p>
      <p><strong>Time:</strong> {sessionData.timeSlot}</p>
      <p><strong>Student:</strong> {sessionData.student.fullName}</p>
      <p><strong>Counselor:</strong> {sessionData.counselor.fullName}</p>
      <p><strong>Notes:</strong> {sessionData.notes}</p>
    </div>
  );
};

SessionDetails.propTypes = {
  sessionData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppointmentHistory;