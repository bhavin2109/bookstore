import axiosInstance from "../api/axios";

// Using centralized axios instance
const API = axiosInstance;

// GET MY SELLER PROFILE
export const getMySellerProfile = async () => {
    try {
        const response = await API.get("/api/seller/profile");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// UPDATE SELLER PROFILE
export const updateSellerProfile = async (sellerData) => {
    try {
        const response = await API.put("/api/seller/profile", sellerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// GET MY PRODUCTS
export const getMyProducts = async () => {
    try {
        const response = await API.get("/api/seller/products");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// GET PUBLIC SHOP
export const getPublicShop = async (slug) => {
    try {
        const response = await API.get(`/api/seller/shop/${slug}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
