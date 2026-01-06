import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authServices';

// Async Thunks
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        return await authService.registerUser(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        return await authService.loginUser(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout();
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Registration typically doesn't auto-login or provide token immediately if OTP required
                // Adjust based on your flow. Assuming OTP flow:
                state.message = 'Registration successful, please verify OTP.';
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            });
    },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;
