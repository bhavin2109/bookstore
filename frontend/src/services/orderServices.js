import axios from "axios";

import { API_URL as BASE_URL } from "../config/api";

// Base URL for the API
const API_URL = `${BASE_URL}/api/orders`;

// Create a new order
const createOrder = async (orderData) => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, orderData, config);
    return response.data;
};

// Get order details by ID
const getOrderById = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Pay for order (update status)
const payOrder = async (orderId, paymentResult) => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(
        `${API_URL}/${orderId}/pay`,
        paymentResult,
        config
    );
    return response.data;
};

// Get logged-in user's orders
const getMyOrders = async () => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/myorders`, config);
    return response.data;
};

const orderService = {
    createOrder,
    getOrderById,
    payOrder,
    getMyOrders,
};

export default orderService;
