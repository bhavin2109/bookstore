import { createSlice } from '@reduxjs/toolkit';

const sellerSlice = createSlice({
    name: 'seller',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
});

export default sellerSlice.reducer;
