import axios from 'axios';

const api = process.env.REACT_APP_BASE_URL;

export const loginAdmin = async (credentials) => {
    try {
        const response = await axios.post(`${api}/auth/login`, {
            username: credentials.username,
            password: credentials.password
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data;
        }
        throw new Error('Token not found in response');
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        alert(message);
        throw error;
    }
};

export const loginAdminClb = async (credentials) => {
    try {
        const response = await axios.post(`${api}/auth/login`, {
            username: credentials.username,
            password: credentials.password
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data;
        }
        throw new Error('Token not found in response');
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        alert(message);
        throw error;
    }
};
