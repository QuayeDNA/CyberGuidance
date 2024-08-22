import axios from 'axios';

export const resendVerificationEmail = async (email) => {
    try {
        // Make the POST request to the resend verification email endpoint
        const response = await axios.post('https://cyber-guidance.onrender.com/resend-verification-email', { email });

        // Return the success message from the response
        return response.data.message;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Resend verification email error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to resend verification email. Please try again.');
    }
};

export const requestPasswordReset = async (email) => {
    try {
        // Make the POST request to the password reset request endpoint
        const response = await axios.post('https://cyber-guidance.onrender.com/api/forgot-password', { email });

        // Return the success message from the response
        return response.data.message;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Password reset request error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to request password reset. Please try again.');
    }
};

export const resetPassword = async (email, otp, newPassword) => {
    try {
        // Make the POST request to the reset password endpoint
        const response = await axios.post('https://cyber-guidance.onrender.com/api/reset-password', { email, otp, newPassword });

        // Return the success message from the response
        return response.data.message;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Password reset error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to reset password. Please try again.');
    }
};

export const updatePersonalInfo = async (personalInfo, profilePicture) => {
    try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        
        // Append personal info fields to FormData
        Object.keys(personalInfo).forEach(key => {
            if (personalInfo[key]) {
                formData.append(key, personalInfo[key]);
            }
        });

        // Append profile picture file to FormData if provided
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        // Make the PUT request to update personal info
        const response = await axios.put('https://cyber-guidance.onrender.com/api/personal-info', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
            },
        });

        // Return the updated user data
        return response.data;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Personal info update error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to update personal information. Please try again.');
    }
};

export const updateAreaOfInterest = async (areaOfInterest) => {
    try {
        // Ensure areaOfInterest is an array
        const data = Array.isArray(areaOfInterest) ? areaOfInterest : [areaOfInterest];

        // Make the PUT request to update area of interest
        const response = await axios.put('https://cyber-guidance.onrender.com/api/area-of-interest', { areaOfInterest: data }, {
            headers: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
            },
        });

        // Return the updated student data
        return response.data;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Area of interest update error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to update area of interest. Please try again.');
    }
};

// Function to update counselor specialties
export const updateSpecialties = async (specialties) => {
    try {
      // Retrieve the token from localStorage as a plain string
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No token found, please log in.');
      }
  
      const response = await axios.put('https://cyber-guidance.onrender.com/api/update-specialties', specialties, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error updating specialties:', error);
      throw error.response ? error.response.data : new Error('Network error');
    }
  };