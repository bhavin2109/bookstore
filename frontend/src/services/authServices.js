import axios from 'axios';
import { API_URL } from '../config/api';

const API = axios.create({
  baseURL: API_URL + '/api/user',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  try {
    const response = await API.post('/register', {
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
    const response = await API.post('/verify-otp', {
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
    const response = await API.post('/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await API.post('/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await API.post('/google', { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};