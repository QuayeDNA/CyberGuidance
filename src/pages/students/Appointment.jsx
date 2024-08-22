import { useState, useEffect, Fragment  } from 'react';
import { useAuth } from '../../components/contexts/AuthContext'; // Assuming you have an AuthContext setup
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import {FaSpinner} from 'react-icons/fa';
import moment from 'moment';

const AppointmentHistory = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await fetch('https://cyber-guidance.onrender.com/api/appointment-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointment history');
        }

        const data = await response.json();
        setAppointments(data.appointments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching appointment history:', error);
        setIsLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, [token]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Appointment History</h1>

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
         <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
         <p className="ml-2">Loading recommended counselors...</p>
       </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
              onClick={() => handleAppointmentClick(appointment)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {appointment.counselor.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{appointment.counselor.fullName}</h3>
                  <p className="text-gray-600 text-xs">
                    Created on: {moment(appointment.date).format('Do MMMM YYYY [at] h:mm A')}
                  </p>
                </div>
              </div>
              <div className="ml-16">
                <p className="text-gray-600 mb-2"><strong>Reason:</strong> {appointment.reason}</p>
                <p className="text-gray-600 mb-2"><strong>Time:</strong> {moment(appointment.timeSlot, 'HH:mm').format('h:mm A')}</p>
                <p className="text-gray-600 mb-2"><strong>Status:</strong> {appointment.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
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
                  {selectedAppointment && (
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                          {selectedAppointment.counselor.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{selectedAppointment.counselor.fullName}</h3>
                          <p className="text-gray-600 text-sm">{selectedAppointment.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{selectedAppointment.reason}</p>
                      <p className="text-gray-600 mb-2">
                        Time: {moment(selectedAppointment.timeSlot, 'HH:mm').format('h:mm A')}
                      </p>
                      <p className="text-gray-600 mb-2">Status: {selectedAppointment.status}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleDialogClose}
                  >
                    Close
                  </button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AppointmentHistory;