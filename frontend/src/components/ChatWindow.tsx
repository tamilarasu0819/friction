import React, { useState } from 'react';
import { MoreVertical, Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface Message {
  id: string;
  content: string;
  isSent: boolean;
  time: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I am the Friction RAG Engine. How can I assist you with your knowledge base today?",
      isSent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-800 h-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Header */}
      <div className="h-20 border-b border-slate-700 bg-slate-900/95 backdrop-blur-md flex items-center justify-between px-8 shadow-sm z-10 relative">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center font-bold text-blue-400 relative shadow-inner border border-slate-600">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg tracking-tight">Friction RAG Engine</h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-xs font-medium text-slate-400">System Ready</p>
            </div>
          </div>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Message Thread Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth relative z-0">
        <div className="max-w-5xl mx-auto flex flex-col justify-end min-h-full pb-4">
          <div className="text-center mb-8 mt-4">
            <span className="text-[11px] font-medium text-slate-400 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-700/50">
              Today
            </span>
          </div>
          
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              content={msg.content}
              isSent={msg.isSent}
              time={msg.time}
            />
          ))}
        </div>
      </div>

      {/* Message Input Area */}
      <MessageInput 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onSend={handleSend}
      />
    </div>
  );
}
