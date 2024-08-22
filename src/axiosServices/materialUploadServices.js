import axios from 'axios';

/**
 * Upload material to the backend.
 * @param {Object} data - The material data to upload.
 * @param {string} data.type - The type of the material (e.g., 'video', 'audio').
 * @param {string} data.title - The title of the material.
 * @param {string} [data.description] - The description of the material.
 * @param {File} [data.file] - The file to upload (optional based on type).
 * @returns {Promise<Object>} - Resolves with the server response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const uploadMaterial = async ({ type, title, description, file }) => {
    try {
        // Prepare form data for file upload
        const formData = new FormData();
        formData.append('type', type);
        formData.append('title', title);
        if (description) formData.append('description', description);
        if (file) formData.append('file', file);

        // Make the POST request to upload the material
        const response = await axios.post('https://cyber-guidance.onrender.com/api/upload-material', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userData')}`,
                'Content-Type': 'multipart/form-data'
            },
        });

        // Return the server response
        return response.data;
    } catch (error) {
        // Log and throw the error with a user-friendly message
        console.error('Error uploading material:', error);
        throw new Error(error?.response?.data?.message || 'Failed to upload material. Please try again.');
    }
};