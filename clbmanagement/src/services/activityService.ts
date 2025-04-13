import axios from "axios";
import { ActivityRequest } from "../models/ActivityRequest";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const createActivity = async (activityRequest: ActivityRequest) => {
    const formData = new FormData();
    formData.append('clubId', activityRequest.clubId.toString());

    // Fix: correct field mapping - was using description for title
    formData.append('title', activityRequest.title);
    formData.append('description', activityRequest.description);

    // Fix: format the date as ISO string in the format the server expects
    const dateObj = activityRequest.startTime instanceof Date
        ? activityRequest.startTime
        : new Date(activityRequest.startTime);

    // Format as YYYY-MM-DDTHH:MM:SS
    const formattedDate = dateObj.toISOString().slice(0, 19);
    formData.append('startTime', formattedDate);

    formData.append('location', activityRequest.location);

    // Only append image if it exists
    if (activityRequest.image) {
        formData.append('image', activityRequest.image);
    }

    return axios.post(`${BASE_URL}/activities/private/create`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
};

export const updateActivity = async (activityRequest: ActivityRequest, id: number) => {
    const formData = new FormData();
    formData.append('clubId', activityRequest.clubId.toString());

    // Fix: correct field mapping - was using description for title
    formData.append('title', activityRequest.title);
    formData.append('description', activityRequest.description);

    // Fix: format the date as ISO string in the format the server expects
    const dateObj = activityRequest.startTime instanceof Date
        ? activityRequest.startTime
        : new Date(activityRequest.startTime);

    // Format as YYYY-MM-DDTHH:MM:SS
    const formattedDate = dateObj.toISOString().slice(0, 19);
    formData.append('startTime', formattedDate);

    formData.append('location', activityRequest.location);

    // Only append image if it exists
    if (activityRequest.image) {
        formData.append('image', activityRequest.image);
    }

    return axios.put(`${BASE_URL}/activities/private/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
};

export const deleteActivity = async (activityId: number) =>
    axios.delete(`${BASE_URL}/activities/private/delete/${activityId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    }
);

export const getActivityDetail = async (activityId: number) => {
    return axios.get(`${BASE_URL}/activities/private/${activityId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const getActivitiesInClub = async (clubId: number, keyword = '', page = 0, size = 10) => {
    return axios.get(`${BASE_URL}/activities/private/all/${clubId}?page=${page}&size=${size}&keyword=${keyword}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}