import React from 'react';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';

const ChatSidebar = ({ history, onNewChat, onClearChat, onSelectSession }) => {
  // Group history by sessions if possible, or just list recent queries.
  // Assuming history is an array of messages. We can just list them or group them.
  // For simplicity, let's just list the past questions as a history view.
  
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full text-white">
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 shadow-md font-medium"
        >
          <PlusCircle size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Recent Conversations
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 px-2">No history yet.</p>
        ) : (
          history.slice().reverse().map((msg, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors duration-200 group"
            >
              <MessageSquare size={16} className="text-gray-400 group-hover:text-green-400" />
              <p className="text-sm truncate flex-1 text-gray-300 group-hover:text-white">
                {msg.question}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onClearChat}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
          <Trash2 size={18} />
          Clear History
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
