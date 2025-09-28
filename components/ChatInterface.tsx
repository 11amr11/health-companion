
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { SendIcon, UserIcon, HealthBotIcon } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  error: string | null;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
          <HealthBotIcon className="w-5 h-5" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl p-4 text-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, error }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <HealthBotIcon className="w-5 h-5" />
            </div>
            <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl p-4 rounded-bl-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              disabled={isLoading}
              className="w-full py-3 pr-12 pl-4 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-200"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-gray-400 transition-colors duration-200"
              aria-label="إرسال"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3 px-4">
            تنويه: "رفيق صحتي" هو مساعد ذكي للمعلومات الصحية العامة فقط، ولا يغني عن استشارة الطبيب أو أخصائي التغذية.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
