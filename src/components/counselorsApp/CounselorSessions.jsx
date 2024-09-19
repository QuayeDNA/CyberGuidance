import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Dialog, Transition, Menu, MenuItem, MenuButton, MenuItems, TransitionChild, DialogTitle, DialogPanel  } from '@headlessui/react';
import { FaSpinner, FaCheck, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { HiDotsVertical, HiFilter } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types'

const API_BASE_URL = 'https://cyber-guidance.onrender.com';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointmentHistory();
  }, []);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointment-history`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`,
        },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      toast.error('Error fetching appointment history.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Header />
        <FilterMenu filter={filter} setFilter={setFilter} />
        {loading ? (
          <LoadingSpinner />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState />
        ) : (
          <AppointmentList appointments={filteredAppointments} setAppointments={setAppointments} />
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

const Header = () => (
  <h2 className="text-2xl font-bold mb-8 text-center text-indigo-800">Appointment History</h2>
);

const FilterMenu = ({ filter, setFilter }) => (
  <div className="mb-6">
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <HiFilter className="w-5 h-5 mr-2" />
        Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </MenuButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
              <MenuItem key={status}>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? 'bg-indigo-500 text-white' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={() => setFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
);

FilterMenu.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
}

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

const AppointmentList = ({ appointments, setAppointments }) => (
  <div className="space-y-6">
    {appointments.map((appointment) => (
      <AppointmentCard key={appointment.id} appointment={appointment} setAppointments={setAppointments} />
    ))}
  </div>
);

AppointmentList.propTypes = {
  appointments: PropTypes.array.isRequired,
  setAppointments: PropTypes.func.isRequired,
}
const AppointmentCard = ({ appointment, setAppointments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleAction = (action) => {
    switch (action) {
      case 'reschedule':
        setModalContent(
          <RescheduleForm
            appointment={appointment}
            onSubmit={handleRescheduleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case 'cancel':
        setModalContent(
          <ConfirmationDialog
            message="Are you sure you want to cancel this appointment?"
            onConfirm={() => handleCancelConfirm(appointment)}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case 'complete':
        setModalContent(
          <ConfirmationDialog
            message="Mark this appointment as completed?"
            onConfirm={() => handleCompleteConfirm(appointment)}
            onCancel={() => setIsModalOpen(false)}
          />
        );
        break;
      case 'view':
        setModalContent(<SessionDetails appointment={appointment} onClose={() => setIsModalOpen(false)} />);
        break;
      default:
        return;
    }
    setIsModalOpen(true);
  };

  AppointmentCard.propTypes = {
    appointment: PropTypes.object.isRequired,
    setAppointments: PropTypes.func.isRequired,
  }


  const updateAppointment = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
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
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg border-l-4 border-indigo-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl font-semibold text-indigo-800 mb-2">{appointment.reason}</p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaCalendarAlt className="mr-2" />
            {moment(appointment.date).format('MMMM D, YYYY')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2" />
            {appointment.timeSlot}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[appointment.status]
            }`}
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
          <Menu as="div" className="relative inline-block text-left mt-2">
            <MenuButton className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
              <HiDotsVertical className="w-5 h-5" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  {['reschedule', 'cancel', 'complete', 'view'].map((action) => (
                    <MenuItem key={action}>
                      {({ focus }) => (
                        <button
                          className={`${
                            focus ? 'bg-indigo-500 text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => handleAction(action)}
                        >
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
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
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {children}
              </DialogPanel>
            </TransitionChild>
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
}

const RescheduleForm = ({ appointment, onSubmit, onCancel }) => {
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment.id, newDate, newTimeSlot);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Reschedule Appointment
      </DialogTitle>
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
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
}

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="space-y-4">
      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Confirmation
      </DialogTitle>
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
}

const SessionDetails = ({ appointment, onClose }) => {
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Appointment Details
      </DialogTitle>
      <div className="space-y-2">
        <DetailItem icon={FaCalendarAlt} label="Date" value={moment(appointment.date).format('MMMM D, YYYY')} />
        <DetailItem icon={FaClock} label="Time" value={appointment.timeSlot} />
        <DetailItem icon={FaUser} label="Reason" value={appointment.reason} />
        <DetailItem icon={FaCheck} label="Status" value={appointment.status} />
        <DetailItem icon={FaUser} label="Student" value={appointment.student.fullName} />
        <DetailItem icon={FaEnvelope} label="Email" value={appointment.student.email} />
        <DetailItem icon={FaPhone} label="Mobile Number" value={appointment.student.mobileNumber} />
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
          appointmentId={appointment.id}
          onClose={() => setIsSessionFormOpen(false)}
          isOpen={isSessionFormOpen}
        />
      )}
    </div>
  );
};

SessionDetails.propTypes = {
  appointment: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 text-indigo-500 mr-2" />
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="ml-2 text-gray-600">{value}</span>
  </div>
);

DetailItem.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

const SessionFormModal = ({ appointmentId, onClose, isOpen }) => {
  // Implement the session form modal here
  // This is a placeholder and should be replaced with the actual implementation
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
          Session Form
        </DialogTitle>
        <p>Session form for appointment ID: {appointmentId}</p>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

SessionFormModal.propTypes = {
  appointmentId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default AppointmentHistory;