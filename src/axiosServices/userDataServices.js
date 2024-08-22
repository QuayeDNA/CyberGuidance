import axios from 'axios';

export const getAllCounselors = async () => {
    try {
        const response = await axios.get('https://cyber-guidance.onrender.com/api/all-counselors', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        });

        return response.data.counselors;
    } catch (error) {
        console.error('Error fetching counselors:', error);
        if (error.response && error.response.status === 500) {
            throw new Error('Internal server error. Please try again later.');
        }
        throw new Error(error?.response?.data?.message || 'Failed to fetch counselors. Please try again.');
    }
};

export const getUserInfo = async () => {
    try {
        const response = await axios.get(`https://cyber-guidance.onrender.com/api/user-info/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        });

        return response.data.user;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error(error?.response?.data?.message || 'Failed to fetch user information. Please try again.');
    }
};

export const fetchAllUsers = async () => {
    try {
        const response = await axios.get('https://cyber-guidance.onrender.com/api/all-users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        });
        return response.data.users; // the response structure is { users: [...] }
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

const API_BASE_URL = 'https://cyber-guidance.onrender.com';

export const fetchUserById = async (userId) => {
    try {

        const response = await axios.get(`${API_BASE_URL}/api/get-userInfo/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        });

        // Use optional chaining to access the user data
        const user = response.data?.user;

        if (user) {
            return user;
        } else {
            throw new Error('Unexpected response format from API');
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Error fetching user data. Please try again later.');
    }
};

export const deleteUserById = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/delete-user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user by ID:', error);
        throw new Error('Error deleting user. Please try again later.');
    }
};