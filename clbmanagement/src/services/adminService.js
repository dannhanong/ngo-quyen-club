import axios from 'axios';

const api = process.env.REACT_APP_BASE_URL;

export const createAdminAccount = async (adminData) => {
    console.log(`Bearer ${localStorage.getItem('accessToken')}`)
    try {
        const response = await axios.post(`${api}/auth/admin/create-account`, adminData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Get token from localStorage
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


