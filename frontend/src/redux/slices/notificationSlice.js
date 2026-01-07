import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        },
        addNotification: (state, action) => {
            state.notifications = [action.payload, ...state.notifications];
            state.unreadCount += 1;
        },
        markRead: (state, action) => {
            const index = state.notifications.findIndex((n) => n._id === action.payload);
            if (index !== -1 && !state.notifications[index].isRead) {
                state.notifications[index].isRead = true;
                state.unreadCount -= 1;
            }
        },
    },
});

export const { setNotifications, addNotification, markRead } = notificationSlice.actions;

export default notificationSlice.reducer;
