import axiosInstance from "../api/axios";

const API = axiosInstance;

export const getMyDeliveryProfile = async () => {
    try {
        const response = await API.get("/api/delivery/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateDeliveryProfile = async (data) => {
    try {
        const response = await API.put("/api/delivery/me", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMyAssignedOrders = async () => {
    try {
        const response = await API.get("/api/delivery/orders");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateDeliveryStatus = async (orderId, status) => {
    try {
        const response = await API.put(
            `/api/delivery/orders/${orderId}/status`,
            { status }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyDeliveryOtp = async (orderId, otp) => {
    try {
        const response = await API.post(
            `/api/delivery/orders/${orderId}/verify`,
            { otp }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllDeliveryPartners = async () => {
    try {
        const response = await API.get("/api/delivery/admin/partners");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
