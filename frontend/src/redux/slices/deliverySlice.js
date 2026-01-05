import { createSlice } from '@reduxjs/toolkit';

const deliverySlice = createSlice({
    name: 'delivery',
    initialState: { assignments: [], loading: false, error: null },
    reducers: {},
});

export default deliverySlice.reducer;
