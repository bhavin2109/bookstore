import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config/api.js";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your AI assistant. Ask me anything about books!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use the API_URL from config (handles dev/prod automatically)
      // Backend route is mounted at /api/chat
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: input,
      });

      const botMessage = { role: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      let errorMessage = "Sorry, I'm having trouble connecting right now.";
      if (error.response?.status === 429) {
        errorMessage =
          "I'm receiving too many messages. Please try again in a moment.";
      }
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: errorMessage, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
                    pointer-events-auto
                    mb-4 w-80 sm:w-96 
                    bg-white dark:bg-gray-800 
                    rounded-2xl shadow-2xl 
                    border border-gray-200 dark:border-gray-700
                    overflow-hidden
                    flex flex-col
                    transition-all duration-300 ease-in-out
                    transform origin-bottom-right
                    ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
                `}
          style={{ height: "500px", maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="bg-primary/10 dark:bg-primary/20 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-blue-600">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={20} className="text-yellow-300" />
              <h3 className="font-bold text-lg">Book Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                                    ${
                                      msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
                                    }
                                    ${
                                      msg.isError
                                        ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10"
                                        : ""
                                    }
                                `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-full text-sm outline-none transition-all dark:text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
                    pointer-events-auto
                    p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
                    ${
                      isOpen
                        ? "bg-gray-200 text-gray-800 rotate-90"
                        : "bg-blue-600 text-white"
                    }
                `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
