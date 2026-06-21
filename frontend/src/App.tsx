import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsModal } from './components/SettingsModal';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'knowledge_base'>('chat');
  const [conversations] = useState([
    { id: '1', title: 'First Landing Test', timestamp: '13:02' },
    { id: '2', title: 'Python Refactoring', timestamp: 'Yesterday' },
    { id: '3', title: 'Brainstorming Ideas', timestamp: 'Oct 24' },
  ]);

  return (
    <div className="flex h-screen w-full bg-bg-app overflow-hidden font-sans text-text-primary transition-colors duration-300">
      <Sidebar 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        activeView={activeView}
        setActiveView={setActiveView}
        conversations={conversations}
      />
      {activeView === 'chat' ? <ChatWindow /> : <KnowledgeBase />}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;