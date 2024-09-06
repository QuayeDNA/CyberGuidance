// src/api/reportAPI.js
import axiosInstance from '../utils/axiosInstance';
export const reportCounselor = async (appointmentId, details) => {
    try {
        console.log("Sending request to report counselor with details:", details);
        const response = await axiosInstance.post('/api/report-counselor', { appointmentId, ...details });
        console.log("Response from server:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error from API:", error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred' };
    }
};

// Mark Report as Under Review
export const markReportUnderReview = async (reportId, adminNotes) => {
    try {
        const response = await axiosInstance.put('/api/review-report', {
            reportId, adminNotes
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred' };
    }
};

// Resolve a Report
export const resolveReport = async (reportId, adminNotes) => {
    try {
        const response = await axiosInstance.put('/api/resolve-report', {
            reportId, adminNotes
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred' };
    }
};

// Get All Reports
export const getAllReports = async () => {
    try {
        const response = await axiosInstance.get('/api/all-reports');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred' };
    }
};

// Reassign Counselor Function
export const reassignCounselor = async (appointmentId,
    newCounselorId) => {
    try {
        const response = await
            axiosInstance.put('/api/reassign-counselor', {
                appointmentId,
                newCounselorId
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while reassigning the counselor.');
    }
    }
};

// Update Counselor Availability Function
export const updateCounselorAvailability = async (isAvailable) => {
    try {
        const response = await
            axiosInstance.patch('/api/counselor-availability', {
                isAvailable
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while updating counselor availability.');
    }
    }
};

// Book Emergency Appointment Function
export const bookEmergencyAppointment = async (counselorId,
    reason) => {
    try {
        const response = await
            axiosInstance.post('/api/emergency-booking', {
                counselorId,
                reason
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while booking an emergency appointment.');
    }
    }
};

// End Emergency Appointment Function
export const endEmergencyAppointment = async (appointmentId) => {
    try {
        const response = await
            axiosInstance.post('/api/end-emergency-session', {
                appointmentId
            });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while ending the emergency appointment.');
    }
    }
};

// Get Dashboard Counts Function
export const getDashboardCounts = async () => {
    try {
        const response = await
            axiosInstance.get('/api/dashbord-overview');
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while fetching the dashboard counts.');
    }
    }
};

// Get All Appointments (Admin) Function
export const getAllAppointmentsAdmin = async () => {
    try {
        const response = await axiosInstance.get('/api/all-appointments');
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while fetching the appointments.');
    }
    }
};

// Get Today's Upcoming Appointments (Admin) Function
export const getTodayUpcomingAppointmentsAdmin = async () => {
    try {
        const response = await
            axiosInstance.get('/api/upcoming-appointments');
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while fetching today\'supcoming appointments.');
    }
    }
};

// Get All Users Function
export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/api/all-users');
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle error responses from the server
            console.error('Server Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            // Handle any other errors
            console.error('Error:', error.message);
            throw new Error('An error occurred while fetching users.');
        }
    }
}