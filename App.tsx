
import React, { useState, useCallback } from 'react';
import type { UserProfile, Message } from './types';
import { generateHealthAdvice } from './services/geminiService';
import ProfileModal from './components/ProfileModal';
import ChatInterface from './components/ChatInterface';
import { HealthBotIcon } from './components/icons';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    setMessages([
      {
        id: Date.now(),
        text: 'أهلاً وسهلاً بك! أنا رفيق صحتي. أخبرني، ما هو هدفك الصحي اليوم؟ هل ترغب في إنقاص وزنك، بناء العضلات، أم مجرد اعتماد أسلوب حياة أكثر صحة؟',
        sender: 'ai',
      },
    ]);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!userProfile) return;

    const userMessage: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMessage];
      const aiResponseText = await generateHealthAdvice(userProfile, text, chatHistory);
      const aiMessage: Message = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      const errorAiMessage: Message = { id: Date.now() + 1, text: errorMessage, sender: 'ai' };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, messages]);

  return (
    <div className="antialiased text-gray-800 flex flex-col h-screen font-[Tajawal,sans-serif]">
      <header className="bg-white shadow-md p-4 flex items-center space-x-4 sticky top-0 z-10">
        <div className="p-2 bg-emerald-500 rounded-full text-white">
          <HealthBotIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold text-emerald-600">رفيق صحتي</h1>
          <p className="text-sm text-gray-500">مساعدك الصحي الذكي</p>
        </div>
      </header>
      
      {!userProfile ? (
        <ProfileModal onSave={handleProfileSave} />
      ) : (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
