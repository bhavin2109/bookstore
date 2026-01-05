import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBooks } from '../../services/bookServices';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await getAllBooks();
        return response.books;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default productSlice.reducer;
