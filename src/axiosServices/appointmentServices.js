import axios from "axios";

/**
 * Book an appointment with a counselor.
 * @param {string} date - The date for the appointment should be in the format: (YYYY-MM-DD).
 * @param {string} timeSlot - The time slot for the appointment should be in the format: (HH:mm-HH:mm).
 * @param {string} reason - The reason for the appointment. Example is the: Career Guidance.
 * @returns {Promise<Object>} - Resolves with the appointment details and counselor information.
 * @throws {Error} - Throws an error if the booking fails.
 */
export const bookAppointment = async (date, timeSlot, reason) => {
    try {
        // Prepare the request payload
        const payload = { date, timeSlot, reason };

        // Log the request structure
        console.log('Booking appointment with payload:', payload);

        // Make the POST request to book the appointment
        const response = await axios.post('https://cyber-guidance.onrender.com/api/book-appointment', payload, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userData')}`,
            },
        });

        // Return the appointment confirmation details
        return response.data;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Appointment booking error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to book appointment. Please try again.');
    }
};
export const getRecommendedCounselors = async () => {
    try {
        const response = await axios.get(
            "https://cyber-guidance.onrender.com/api/recommend-counselors",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userData")}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching recommended counselors:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
            throw new Error(
                `Failed to fetch recommended counselors. Server responded with status code ${error.response.status}.`
            );
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Request data:", error.request);
            throw new Error(
                "Failed to fetch recommended counselors. No response received from the server."
            );
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
            throw new Error(
                "Failed to fetch recommended counselors. An unexpected error occurred."
            );
        }
    }
};
export const getAppointmentHistory = async () => {
    try {
      // Log the request details
      console.log('Fetching appointment history...');
      console.log('Request headers:', {
        Authorization: `Bearer ${localStorage.getItem('userData')}`,
      });
  
      // Make the GET request to fetch appointment history
      const response = await axios.get('https://cyber-guidance.onrender.com/api/appointment-history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userData')}`,
        },
      });
  
      // Log the response details
      console.log('Appointment history response:', response.data);
  
      // Return the list of appointments
      return response.data.appointments;
    } catch (error) {
      // Log the error details
      console.error('Error fetching appointment history:', error);
      console.error('Error response:', error.response?.data);
  
      // Throw a user-friendly error message
      throw new Error(error?.response?.data?.message || 'Failed to fetch appointment history. Please try again.');
    }
  };

const API_BASE_URL = 'https://cyber-guidance.onrender.com';
export const bookAppointmentWithACounselor = async (counselorId, date, timeSlot, reason) => {
    try {
      console.log('Sending booking request:', { counselorId, date, timeSlot, reason });
      const response = await axios.post(`${API_BASE_URL}/api/book-counselor`, {
        counselorId,
        date,
        timeSlot,
        reason,
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw new Error(error.response?.data?.message || 'Error booking appointment. Please try again later.');
    }
  };

export const rescheduleAppointment = async (appointmentId, newDate, newTimeSlot) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/reschedule-appointment`, 
            {
                appointmentId,
                newDate,
                newTimeSlot
            },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        throw new Error(error.response?.data?.message || 'Error rescheduling appointment. Please try again later.'); // Handle error with message
    }
};

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/cancel-appointment`,
            { appointmentId },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error canceling appointment:', error);
        throw new Error(error.response?.data?.message || 'Error canceling appointment. Please try again later.'); // Handle error with message
    }
};

export const completeAppointment = async (appointmentId) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/complete-appointment`,
            { appointmentId },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error marking appointment as completed:', error);
        throw new Error(error.response?.data?.message || 'Error marking appointment as completed. Please try again later.');
    }
};