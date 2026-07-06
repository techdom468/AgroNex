import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { User, Bot, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const ChatMessage = ({ message, isAI }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.answer || message.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 p-4 rounded-xl mb-4 ${
        isAI 
          ? 'bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm' 
          : 'bg-green-900/20 border border-green-800/30'
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAI ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' : 'bg-gray-700 text-gray-300'
      }`}>
        {isAI ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm text-gray-300">
            {isAI ? 'AgroNex AI' : 'You'}
          </span>
          {isAI && (
            <div className="flex items-center gap-3">
              {message.intent && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                  {message.intent} {message.confidence ? `(${message.confidence}%)` : ''}
                </span>
              )}
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy response"
              >
                {copied ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
        
        <div className="text-gray-100 text-sm leading-relaxed prose prose-invert max-w-none">
          {isAI ? (
            <ReactMarkdown>{message.answer}</ReactMarkdown>
          ) : (
             <p>{message.question}</p>
          )}
        </div>
        
        {isAI && message.source && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <span>Source:</span>
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
              {message.source}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
