import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import sellerReducer from './slices/sellerSlice';
import deliveryReducer from './slices/deliverySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        orders: orderReducer,
        admin: adminReducer,
        seller: sellerReducer,
        delivery: deliveryReducer,
    },
});
