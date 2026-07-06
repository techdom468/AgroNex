import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '../components/chat/ChatWindow';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = 'demo-user-123';
  const sessionId = 'session-' + new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history/`, {
        params: { userId, sessionId }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSendMessage = async (question) => {
    const tempMessage = { question, answer: '', isTemp: true };
    setMessages(prev => [...prev, tempMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        question,
        userId,
        sessionId
      });

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = response.data;
        return updated;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: "⚠️ Could not connect to the server. Please check if the backend is running on port 8000.",
          source: "Error"
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear your chat history?")) return;
    // Clear UI immediately regardless of backend result
    setMessages([]);
    try {
      await axios.delete(`${API_BASE_URL}/chat/history/delete/`, {
        params: { userId, sessionId }
      });
    } catch (error) {
      console.error('Failed to clear history from server (cleared locally):', error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatPage;

