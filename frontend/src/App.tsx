import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsModal } from './components/SettingsModal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { KnowledgeBaseProvider } from './context/KnowledgeBaseContext';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'knowledge_base'>('chat');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const fetchConversations = async (t: string) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/conversations', {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setConversations(data);
    } catch(e) { console.error(e); }
  }

  const handleLoginSuccess = async (credentialResponse: any) => {
    const t = credentialResponse.credential;
    setToken(t);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      setUser(data.user);
      fetchConversations(t);
    } catch(e) { console.error(e); }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setConversations([]);
    setActiveConversationId(undefined);
  }

  return (
    <div className="flex h-screen w-full bg-bg-app overflow-hidden font-sans text-text-primary transition-colors duration-300">
      <Sidebar 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        activeView={activeView}
        setActiveView={setActiveView}
        conversations={conversations}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        user={user}
        onSelectConversation={(id) => { setActiveConversationId(id); setActiveView('chat'); }}
      />
      {activeView === 'chat' ? (
        <ChatWindow 
          token={token} 
          conversationId={activeConversationId} 
          setConversationId={setActiveConversationId}
          setActiveView={setActiveView}
        />
      ) : (
        <KnowledgeBase />
      )}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy-client-id";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeProvider>
        <KnowledgeBaseProvider>
          <AppContent />
        </KnowledgeBaseProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;