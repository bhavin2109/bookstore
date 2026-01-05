import axiosInstance from "../api/axios";

// Using the centralized instance
const API = axiosInstance;

// CREATE BOOK
export const createBook = async (data) => {
  try {
    const response = await API.post("/api/books/", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// CREATE MANY BOOKS
export const createManyBooks = async (data) => {
  try {
    const response = await API.post("/api/books/bulk", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET ALL BOOKS
export const getAllBooks = async () => {
  try {
    const response = await API.get("/api/books/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET SINGLE BOOK
export const getBookById = async (id) => {
  try {
    const response = await API.get(`/api/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// UPDATE BOOK
export const updateBook = async (id, data) => {
  try {
    const response = await API.put(`/api/books/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE BOOK
export const deleteBook = async (id) => {
  try {
    const response = await API.delete(`/api/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET BOOK COUNT
export const getBookCount = async () => {
  try {
    const response = await API.get("/api/books/count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET USER COUNT
export const getUserCount = async () => {
  try {
    const response = await API.get("/api/books/user-count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// CREATE REVIEW
export const createReview = async (id, reviewData) => {
  try {
    const response = await API.post(`/api/books/${id}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE REVIEW (Admin)
export const deleteReview = async (bookId, reviewId) => {
  try {
    // Note: The route is /:id/reviews/:reviewId
    const response = await API.delete(`/api/books/${bookId}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET ALL REVIEWS (Admin)
export const getAllReviews = async () => {
  try {
    const response = await API.get("/api/books/reviews/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
