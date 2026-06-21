import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsModal } from './components/SettingsModal';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-bg-app overflow-hidden font-sans text-text-primary transition-colors duration-300">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <ChatWindow />
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