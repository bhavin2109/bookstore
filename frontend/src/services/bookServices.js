import axios from "axios";
import { API_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_URL}/api/books`,
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE BOOK
export const createBook = async (data, token) => {
  try {
    const response = await API.post("/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// CREATE MANY BOOKS
export const createManyBooks = async (data, token) => {
  try {
    const response = await API.post("/bulk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET ALL BOOKS
export const getAllBooks = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET SINGLE BOOK
export const getBookById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// UPDATE BOOK
export const updateBook = async (id, data, token) => {
  try {
    const response = await API.put(`/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE BOOK
export const deleteBook = async (id, token) => {
  try {
    const response = await API.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET BOOK COUNT
export const getBookCount = async () => {
  try {
    const response = await API.get("/count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET USER COUNT
export const getUserCount = async () => {
  try {
    const response = await API.get("/user-count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
