import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTED_QUESTIONS = [
  "🌦 Today's Weather",
  "🌾 Recommend Crop",
  "🦠 Plant Disease",
  "🏛 Government Schemes"
];

const ChatWindow = ({ messages, onSendMessage, onClearChat, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleSuggestedClick = (q) => {
    const query = q.replace(/^[\u{1F300}-\u{1FFFF}\s]+/u, '').trim();
    onSendMessage(query);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-gray-100 h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center text-sm shadow-md shadow-green-900/40">
            🌱
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">AgroNex AI Assistant</h2>
            <p className="text-xs text-green-400">Online — Agriculture Expert</p>
          </div>
        </div>
        {onClearChat && messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-green-900/50">
                <span className="text-3xl">🌱</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to AgroNex AI</h2>
              <p className="text-gray-400 mb-8 max-w-md text-sm">
                Your intelligent farming assistant. Ask about weather, crop recommendations, diseases, or government schemes.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedClick(q)}
                    className="bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-green-500 text-sm py-2 px-4 rounded-full transition-all duration-200 text-gray-300 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.question && <ChatMessage message={msg} isAI={false} />}
                  {(msg.answer || msg.isTemp === false) && <ChatMessage message={msg} isAI={true} />}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 p-4 rounded-xl mb-4 bg-gray-800/60 border border-gray-700/50 items-center w-fit">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                  <span className="text-gray-400 text-sm animate-pulse">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about agriculture..."
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-700 focus:border-green-500 rounded-xl py-3.5 pl-4 pr-14 outline-none transition-colors text-white placeholder-gray-500 disabled:opacity-50 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            AgroNex AI can make mistakes. Always verify critical information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
