import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { FaSpinner, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await axios.get(
          "https://cyber-guidance.onrender.com/api/appointment-history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        setError("Error fetching appointment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, []);

  const handleRescheduleAppointment = async (appointment) => {
    // Add your logic to reschedule the appointment
    console.log("Rescheduling appointment:", appointment);
  };

  const handleCancelAppointment = async (appointment) => {
    // Add your logic to cancel the appointment
    console.log("Canceling appointment:", appointment);
  };

  const handleCompleteAppointment = async (appointment) => {
    // Add your logic to complete the appointment
    console.log("Completing appointment:", appointment);
  };

  const handleViewSessionData = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
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
      <h2 className="text-3xl font-bold mb-6 text-center">
        Appointment History
      </h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gray-100 rounded-lg p-4 md:p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-xs">
                    Created on:{" "}
                    {moment(appointment.date).format(
                      "Do MMMM YYYY [at] h:mm A"
                    )}
                  </p>
                  <p className="text-gray-600 font-medium">
                    {appointment.timeSlot}
                  </p>
                  <p className="text-gray-600 font-medium">
                    {appointment.reason}
                  </p>
                </div>
                <div>
                  <p
                    className={`font-bold ${
                      appointment.status === "pending"
                        ? "text-yellow-500"
                        : appointment.status === "cancelled"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => handleRescheduleAppointment(appointment)}>
                  <FaEdit />
                  <span>Reschedule</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => handleCancelAppointment(appointment)}>
                  <FaTimes />
                  <span>Cancel</span>
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => handleCompleteAppointment(appointment)}>
                  <FaCheck />
                  <span>Complete</span>
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => handleViewSessionData(appointment)}>
                  <span>View Session Data</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <Transition
          appear
          show={isModalOpen}
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto">
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsModalOpen(false)}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
              </Transition.Child>

              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    Appointment Details
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.reason}
                    </p>
                    {selectedAppointment.student && (
                      <div className="mt-2 text-gray-600">
                        <p>Student: {selectedAppointment.student.fullName}</p>
                        <p>Email: {selectedAppointment.student.email}</p>
                        <p>Phone: {selectedAppointment.student.mobileNumber}</p>
                      </div>
                    )}
                    {selectedAppointment.counselor && (
                      <div className="mt-2 text-gray-600">
                        <p>
                          Counselor: {selectedAppointment.counselor.fullName}
                        </p>
                        <p>Email: {selectedAppointment.counselor.email}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      Created on:{" "}
                      {moment(selectedAppointment.date).format(
                        "Do MMMM YYYY [at] h:mm A"
                      )}
                    </p>
                    <p className="text-gray-600">
                      Time Slot: {selectedAppointment.timeSlot}
                    </p>
                    <p
                      className={`font-bold mt-2 ${
                        selectedAppointment.status === "pending"
                          ? "text-yellow-500"
                          : selectedAppointment.status === "cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}>
                      Status:{" "}
                      {selectedAppointment.status.charAt(0).toUpperCase() +
                        selectedAppointment.status.slice(1)}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default AppointmentHistory;
