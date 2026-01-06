import axiosInstance from '../api/axios';

const API = axiosInstance;

export const registerUser = async (data) => {
  try {
    const response = await API.post('/api/user/register', {
      name: data.name || data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await API.post('/api/user/verify-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await API.post('/api/user/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const forgotPassword = async (email) => {
  try {
    const response = await API.post('/api/user/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await API.post(`/api/user/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await API.post('/api/user/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await API.post('/api/user/google', { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await API.get('/api/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const requestRole = async (role) => {
  try {
    const response = await API.post('/api/user/request-role', { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRoleRequests = async () => {
  try {
    const response = await API.get('/api/user/admin/role-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRoleRequest = async (id, status) => {
  try {
    const response = await API.put(
      `/api/user/admin/role-requests/${id}`,
      { status }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Wishlist Services
export const toggleWishlist = async (bookId) => {
  try {
    const response = await API.post('/api/user/wishlist', { bookId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getWishlist = async () => {
  try {
    const response = await API.get('/api/user/wishlist');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Address Services
export const addAddress = async (address) => {
  try {
    const response = await API.post('/api/user/address', address);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeAddress = async (addressId) => {
  try {
    const response = await API.delete(`/api/user/address/${addressId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAddress = async (addressId, address) => {
  try {
    const response = await API.put(`/api/user/address/${addressId}`, address);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserAddresses = async () => {
  try {
    const response = await API.get('/api/user/address');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};