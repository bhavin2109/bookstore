import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'orders',
    initialState: { orders: [], loading: false, error: null },
    reducers: {},
});

export default orderSlice.reducer;
