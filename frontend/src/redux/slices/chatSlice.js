import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedChat: null,
        chats: [],
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
    },
});

export const { setSelectedChat, setChats, setMessages, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
