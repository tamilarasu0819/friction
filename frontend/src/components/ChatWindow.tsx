import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Bot, ChevronDown } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface Message {
  id: string;
  content: string;
  isSent: boolean;
  time: string;
  modelUsed?: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userText = inputText;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.bot_reply || "No reply from server",
        isSent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error communicating with the server.",
        isSent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg-app h-full relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--theme-text-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Header */}
      <div className="h-20 border-b border-border-color bg-header backdrop-blur-md flex items-center justify-between px-8 shadow-sm z-10 relative transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-full bg-bg-panel flex items-center justify-center font-bold text-accent relative shadow-inner border border-border-color transition-colors">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-text-primary font-semibold text-lg tracking-tight">Friction RAG Engine</h2>
            <div className="flex items-center mt-0.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="text-xs font-medium text-text-secondary">System Ready</p>
              </div>
              <span className="text-text-muted mx-2 text-[10px]">•</span>
              <div className="relative flex items-center">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none bg-bg-panel border border-border-color hover:border-text-muted text-text-primary text-xs font-medium rounded-full pl-3 pr-7 py-0.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer transition-colors shadow-sm"
                >
                  <option value="llama-3.1-8b-instant">Friction 1</option>
                  <option value="llama-3.3-70b-versatile">Friction Pro</option>
                  <option value="openai/gpt-oss-120b">Friction Adv</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        <button className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-full transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Message Thread Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth relative z-0">
        <div className="max-w-4xl mx-auto flex flex-col pt-4 pb-6">
          <div className="text-center mb-8">
            <span className="text-[12px] font-medium text-text-secondary bg-bg-panel px-4 py-1.5 rounded-full border border-border-color">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              isSent={msg.isSent}
              time={msg.time}
              modelUsed={msg.modelUsed}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-bg-panel border border-border-color rounded-3xl rounded-tl-sm px-5 py-4 text-text-primary shadow-sm transition-colors">
                <div className="flex space-x-1.5 items-center h-5">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <MessageInput
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
