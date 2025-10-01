import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { UserIcon, HealthBotIcon, SendIcon } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  error: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  error,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/30 to-white/50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border-2 border-emerald-100 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                <HealthBotIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-700 mb-3">مرحباً بك في رفيق صحتك</h2>
              <p className="text-gray-600 leading-relaxed">
                أنا هنا لمساعدتك في رحلتك الصحية. اسألني عن التغذية، التمارين، أو أي نصائح صحية تحتاجها!
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-slide-in ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500'
              }`}
            >
              {message.sender === 'user' ? (
                <UserIcon className="w-6 h-6 text-white" />
              ) : (
                <HealthBotIcon className="w-6 h-6 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] p-4 rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 rounded-tl-sm border border-emerald-100'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
              <span className={`text-xs mt-2 block ${
                message.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'
              }`}>
                {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-slide-in">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <HealthBotIcon className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-md border border-emerald-100">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-emerald-100 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              disabled={isLoading}
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-gray-50 focus:bg-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-500 mt-3 max-w-4xl mx-auto">
          تنويه: "رفيق صحي" هو مساعد ذكي للمعلومات الصحية العامة فقط، ولا يعني عن استشارة الطبيب أو أخصائي التغذية.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;