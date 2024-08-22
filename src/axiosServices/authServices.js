import axios from "axios";

export const signupUser = async (userData, role) => {
    try {
        let endpoint;

        // Determine the endpoint based on the role
        switch (role) {
            case 'student':
                endpoint = 'https://cyber-guidance.onrender.com/api/signup';
                break;
            case 'counselor':
                endpoint = 'https://cyber-guidance.onrender.com/api/counselor-signup';
                break;
            case 'admin':
                endpoint = 'https://cyber-guidance.onrender.com/api/admin-signup';
                break;
            default:
                throw new Error('Invalid role');
        }

        // Make the POST request to the appropriate signup endpoint
        const response = await axios.post(endpoint, userData);

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle and log the error
        console.error('Signup error:', error);

        // Use optional chaining to safely access the error message
        throw new Error(error?.response?.data?.message || 'An error occurred during signup.');
    }
};

export const loginUser = async (credentials) => {
    try {
        // Make the POST request to the login endpoint
        const response = await axios.post('https://cyber-guidance.onrender.com/api/login', credentials);

        // Extract and return relevant data from the response
        const { isAdmin, isCounselor, isStudent, isFirstLogin, token } = response.data;
        return { isAdmin, isCounselor, isStudent, isFirstLogin, token };
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Login error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to log in. Please check your credentials and try again.');
    }
};

export const logoutUser = async () => {
    try {
        // Make the GET request to the logout endpoint
        const response = await axios.get('https://cyber-guidance.onrender.com/api/logout');

        // Return the success message from the response
        return response.data.message;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Logout error:', error);
        throw new Error(error?.response?.data?.message || 'Failed to log out. Please try again.');
    }
};