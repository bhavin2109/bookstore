import io from 'socket.io-client';
import { store } from '../redux/store';
import { addNotification } from '../redux/slices/notificationSlice';
import { addMessage } from '../redux/slices/chatSlice';

let socket;

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const connectSocket = (userToken) => {
    if (socket) return socket;

    socket = io(ENDPOINT, {
        query: { token: userToken }
    });

    socket.on('connected', () => console.log('Socket Connected'));

    socket.on('notification', (notification) => {
        store.dispatch(addNotification(notification));
    });

    socket.on('message_received', (newMessage) => {
        store.dispatch(addMessage(newMessage));
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const emitJoinChat = (chatId) => {
    if (socket) socket.emit('join_chat', chatId);
};

export const emitTyping = (chatId) => {
    if (socket) socket.emit('typing', chatId);
};

export const emitStopTyping = (chatId) => {
    if (socket) socket.emit('stop_typing', chatId);
};

export const emitNewMessage = (message) => {
    if (socket) socket.emit('new_message', message);
};
