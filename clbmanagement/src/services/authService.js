import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Changed from import jwt_decode

const api = process.env.REACT_APP_BASE_URL;

export const loginService = async (credentials) => {
    try {
        const response = await axios.post(`${api}/auth/login`, credentials);
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data;
        }
        throw new Error('Token not found in response');
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const decodeToken = () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        return jwtDecode(token); // Changed from jwt_decode to jwtDecode
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if user has 'ADMIN' role
export const isAdmin = () => {
    const decodedToken = decodeToken();
    if (!decodedToken || !decodedToken.roles) return false;
    return decodedToken.roles.includes('ADMIN');
};

// Check if user has 'TEACHER' role
export const isTeacher = () => {
    const decodedToken = decodeToken();
    if (!decodedToken || !decodedToken.roles) return false;
    return decodedToken.roles.includes('TEACHER');
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles = []) => {
    const decodedToken = decodeToken();
    if (!decodedToken || !decodedToken.roles) return false;
    return roles.some(role => decodedToken.roles.includes(role));
};

// Check if token is still valid (not expired)
export const isTokenValid = () => {
    const decodedToken = decodeToken();
    if (!decodedToken || !decodedToken.exp) return false;
    
    // Convert expiration time to milliseconds and compare with current time
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp > currentTime;
};

// Get current username from token
export const getCurrentUsername = () => {
    const decodedToken = decodeToken();
    return decodedToken?.sub || null;
};

// Logout function that clears token
export const logout = async () => {
    localStorage.removeItem('accessToken');
    const response = await axios.post(`${api}/auth/logout`);
    return response.data;
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${api}/auth/public/get-all-users`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export const getAllTeachers = async () => {
    try {
        const response = await axios.get(`${api}/auth/public/get-all-teachers`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export const getProfile = async () => {
    const response = await axios.get(`${api}/auth/get/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return response.data;
}

export const updateProfile = async (data) => {
    const formData = new FormData();

    if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
    }
    formData.append('name', data.name);
    formData.append('phoneNumber', data.phoneNumber);

    const response = await axios.put(`${api}/auth/update-profile`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return response.data;
}