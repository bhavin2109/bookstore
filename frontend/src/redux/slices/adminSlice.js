import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: { stats: {}, loading: false, error: null },
    reducers: {},
});

export default adminSlice.reducer;
