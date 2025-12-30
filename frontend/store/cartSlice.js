import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: JSON.parse(localStorage.getItem('cart')) || [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const exist = state.items.find((p) => String(p.id) === String(item.id));
            if (exist) {
                exist.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => String(item.id) !== String(action.payload.id));
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        increaseQuantity: (state, action) => {
            const item = state.items.find((p) => String(p.id) === String(action.payload.id));
            if (item) {
                item.quantity += 1;
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find((p) => String(p.id) === String(action.payload.id));
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

