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

interface ChatWindowProps {
  token?: string | null;
  conversationId?: string;
  setConversationId?: (id: string) => void;
  setActiveView?: (view: 'chat' | 'knowledge_base') => void;
}

export function ChatWindow({ token, conversationId, setConversationId, setActiveView }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  const fullTextRef = useRef("");
  const isStreamFinishedRef = useRef(false);
  const displayedTextLengthRef = useRef(0);
  const [activeBotMessageId, setActiveBotMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'llama-3.1-8b-instant', label: 'Friction 1' },
    { id: 'llama-3.3-70b-versatile', label: 'Friction Pro' },
    { id: 'openai/gpt-oss-120b', label: 'Friction Adv' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!activeBotMessageId) return;

    let animationFrameId: number;

    const updateDisplay = () => {
      const fullText = fullTextRef.current;
      const currentLen = displayedTextLengthRef.current;
      let isFinished = false;

      if (currentLen < fullText.length) {
        const diff = fullText.length - currentLen;
        let charsToAdd = 1;
        if (diff > 20) {
          charsToAdd = Math.floor(diff / 4); // Speed up significantly if far behind
        } else if (diff > 10) {
          charsToAdd = 5;
        } else if (diff > 5) {
          charsToAdd = 3;
        } else {
          charsToAdd = 1;
        }
        
        const nextLength = Math.min(currentLen + charsToAdd, fullText.length);
        displayedTextLengthRef.current = nextLength;
        const newText = fullText.substring(0, nextLength);
        
        setMessages(currentMessages => 
          currentMessages.map(msg => 
            msg.id === activeBotMessageId 
              ? { ...msg, content: newText + "▍" } 
              : msg
          )
        );
      } else if (isStreamFinishedRef.current && currentLen === fullText.length) {
        setMessages(currentMessages => 
          currentMessages.map(msg => 
            msg.id === activeBotMessageId 
              ? { ...msg, content: fullText } 
              : msg
          )
        );
        isFinished = true;
      }

      if (isFinished) {
        setActiveBotMessageId(null);
      } else {
        animationFrameId = requestAnimationFrame(updateDisplay);
      }
    };

    animationFrameId = requestAnimationFrame(updateDisplay);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeBotMessageId]);



  const createdConversationIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (conversationId) {
      if (createdConversationIdRef.current === conversationId) {
        // We just created this conversation locally via handleSend.
        // Local state is already perfectly up-to-date, so skip the redundant fetch which would wipe the active stream.
        createdConversationIdRef.current = null;
        return;
      }

      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch(`https://friction-othk.onrender.com/api/chat/${conversationId}`, { headers })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setMessages(data.map((m: any) => ({
            id: m.id,
            content: m.content,
            isSent: m.role === 'user',
            time: new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      })
      .catch(e => console.error("Error fetching history:", e));
    } else {
      setMessages([{
        id: '1',
        content: "Hello! I am the Friction RAG Engine. How can I assist you with your knowledge base today?",
        isSent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [conversationId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isThinking) return;

    const userText = inputText;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      content: "▍",
      isSent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel
    };

    setMessages(prevMessages => [...prevMessages, newMessage, initialBotMessage]);
    setInputText('');
    setIsThinking(true);
    
    fullTextRef.current = "";
    displayedTextLengthRef.current = 0;
    isStreamFinishedRef.current = false;
    setActiveBotMessageId(botMessageId);

    try {
      const response = await fetch('https://friction-othk.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userText, model: selectedModel, conversation_id: conversationId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const convId = response.headers.get('X-Conversation-Id');
      if (convId && setConversationId && convId !== conversationId) {
        createdConversationIdRef.current = convId;
        setConversationId(convId);
      }

      setIsThinking(false);

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        fullTextRef.current += decoder.decode(value, { stream: true });
      }

      isStreamFinishedRef.current = true;

    } catch (error) {
      console.error("Error communicating with backend:", error);
      setIsThinking(false);
      isStreamFinishedRef.current = true;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error communicating with the server.",
        isSent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
       setActiveView?.('knowledge_base');
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-bg-app h-full relative overflow-hidden transition-colors duration-300"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
              <div className="relative flex items-center" ref={dropdownRef}>
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 bg-bg-panel border border-border-color hover:border-text-muted text-text-primary text-xs font-medium rounded-full pl-3 pr-2 py-1 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer transition-colors shadow-sm"
                >
                  {models.find(m => m.id === selectedModel)?.label || 'Select Model'}
                  <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isModelDropdownOpen && (
                  <div className="absolute top-full mt-1.5 left-0 w-[140px] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {models.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[11px] font-medium transition-colors ${
                          selectedModel === model.id 
                            ? 'bg-accent/10 text-accent' 
                            : 'text-text-primary hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {model.label}
                      </button>
                    ))}
                  </div>
                )}
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <MessageInput
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onSend={handleSend}
        disabled={isThinking}
      />
    </div>
  );
}
