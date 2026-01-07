import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  emitJoinChat,
  emitNewMessage,
  emitTyping,
  emitStopTyping,
  getSocket,
} from "../services/socketService";
import {
  setChats,
  setSelectedChat,
  setMessages,
  addMessage,
} from "../redux/slices/chatSlice";
import axios from "axios";
import { Send, User } from "lucide-react"; // Assuming lucide-react is installed or use standard icons

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { chats, selectedChat, messages } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (token) {
      const s = connectSocket(token);
      s.on("connected", () => setSocketConnected(true));
    }
    fetchChats();
    // eslint-disable-next-line
  }, [token]);

  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get("/api/chat", config); // Using existing /api/chat or /api/messages?
      // Wait, I created /api/messages for MESSAGE controller, but existing chat controller was on /api/chat.
      // My messageRoutes.js is mounted on /api/messages.
      // BUT messageRoutes.js has `fetchChats` on `/` -> `/api/messages`.
      // Let's use /api/messages
      const { data: chatData } = await axios.get("/api/messages", config);
      dispatch(setChats(chatData));
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        `/api/messages/message/${selectedChat._id}`,
        config
      );
      dispatch(setMessages(data));
      emitJoinChat(selectedChat._id);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load messages", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/messages/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        emitNewMessage(data);
        dispatch(addMessage(data));
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  // Helper to get sender name in 1-on-1
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Sidebar */}
      <div
        className={`w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col ${
          selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => dispatch(setSelectedChat(chat))}
              className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                selectedChat === chat ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </p>
                  {chat.latestMessage && (
                    <p className="text-sm text-gray-500 truncate w-40">
                      <span className="font-semibold">
                        {chat.latestMessage.sender.name}:{" "}
                      </span>
                      {chat.latestMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(setSelectedChat(null))}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  &larr; Back
                </button>
                <h3 className="font-semibold text-gray-800">
                  {!selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName}
                </h3>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              {loading ? (
                <div className="text-center text-gray-500 mt-10">
                  Loading messages...
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={m._id}
                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      m.sender._id === user._id
                        ? "bg-blue-600 text-white self-end rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-700"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={sendMessage}
                />
                <button
                  onClick={() => sendMessage({ key: "Enter" })}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
            <User size={64} className="mb-4 opacity-50" />
            <p className="text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
