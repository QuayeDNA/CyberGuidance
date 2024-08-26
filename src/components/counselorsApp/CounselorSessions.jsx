import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";
import SessionFormModal from "./SessionFormModal";
import { FaSpinner, FaEdit, FaTimes, FaCheck, FaEye } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const API_BASE_URL = "https://cyber-guidance.onrender.com";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error("Error fetching appointment history.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, appointment) => {
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
          handleViewSessionDetails(appointment);
          break;
      default:
        return;
    }
    setIsModalOpen(true);
  };

  const handleRescheduleSubmit = async (appointmentId, newDate, newTimeSlot) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/reschedule-appointment`,
        { appointmentId, newDate, newTimeSlot },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment(response.data.appointment);
      setIsModalOpen(false);
      toast.success("Appointment rescheduled successfully.");
    } catch (error) {
      toast.error("Error rescheduling appointment. Please try again.");
    }
  };

  const handleCancelConfirm = async (appointment) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/cancel-appointment`,
        { appointmentId: appointment.id },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment({ ...appointment, status: "cancelled" });
      setIsModalOpen(false);
      toast.success("Appointment cancelled successfully.");
    } catch (error) {
      toast.error("Error canceling appointment. Please try again.");
    }
  };

  const handleCompleteConfirm = async (appointment) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/complete-appointment`,
        { appointmentId: appointment.id },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateAppointment({ ...appointment, status: "completed" });
      setIsModalOpen(false);
      toast.success("Appointment marked as completed.");
    } catch (error) {
      toast.error("Error marking appointment as completed. Please try again.");
    }
  };

  const handleViewSessionDetails = (appointment) => {
    setModalContent(<SessionDetails sessionData={appointment} onClose={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  const updateAppointment = (updatedAppointment) => {
    setAppointments(
      appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-800">Appointment History</h2>
        {loading ? (
          <LoadingSpinner />
        ) : appointments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
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
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md">
    <p className="text-gray-500 text-lg">No appointments found.</p>
  </div>
);

const AppointmentCard = ({ appointment, onAction }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
    completed: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg border-l-4 border-indigo-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-xl font-semibold text-indigo-800 mb-2">{appointment.reason}</p>
          <p className="text-sm text-gray-600">
            {moment(appointment.date).format("MMMM D, YYYY")} at {appointment.timeSlot}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 ${
            statusColors[appointment.status]
          }`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
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
  const baseClasses = "flex items-center space-x-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors duration-200";
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
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const RescheduleForm = ({ appointment, onSubmit, onCancel }) => {
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment.id, newDate, newTimeSlot);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Reschedule Appointment
      </Dialog.Title>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="newDate">
          New Date
        </label>
        <input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          id="newDate"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="newTimeSlot">
          New Time Slot
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          id="newTimeSlot"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
          required
        >
          <option value="">Select a time slot</option>
          <option value="09:00-10:00">09:00-10:00</option>
          <option value="10:00-11:00">10:00-11:00</option>
          <option value="11:00-12:00">11:00-12:00</option>
          <option value="12:00-13:00">12:00-13:00</option>
          <option value="13:00-14:00">13:00-14:00</option>
          <option value="14:00-15:00">14:00-15:00</option>
          <option value="15:00-16:00">15:00-16:00</option>
        </select>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
    <div className="space-y-4">
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Confirmation
      </Dialog.Title>
      <p className="text-sm text-gray-500">{message}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onConfirm}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Confirm
          </button>
        <button
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Appointment Details
      </Dialog.Title>
      <div className="space-y-2">
        <p><strong className="text-gray-700">Date:</strong> {moment(sessionData.date).format("MMMM D, YYYY")}</p>
        <p><strong className="text-gray-700">Time:</strong> {sessionData.timeSlot}</p>
        <p><strong className="text-gray-700">Reason:</strong> {sessionData.reason}</p>
        <p><strong className="text-gray-700">Status:</strong> {sessionData.status}</p>
        <p><strong className="text-gray-700">Student:</strong> {sessionData.student.fullName}</p>
        <p><strong className="text-gray-700">Email:</strong> {sessionData.student.email}</p>
        <p><strong className="text-gray-700">Mobile Number:</strong> {sessionData.student.mobileNumber}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          onClick={() => setIsSessionFormOpen(true)}
        >
          View Sessions Form
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      {isSessionFormOpen && (
        <SessionFormModal
          appointmentId={sessionData.id}
          onClose={() => setIsSessionFormOpen(false)}
          isOpen={isSessionFormOpen}
        />
      )}
    </div>
  );
};

SessionDetails.propTypes = {
  sessionData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppointmentHistory;