import { MessageSquare, Database, Settings, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

interface SidebarProps {
  onOpenSettings?: () => void;
  activeView?: 'chat' | 'knowledge_base';
  setActiveView?: (view: 'chat' | 'knowledge_base') => void;
  conversations?: { id: string; title: string; updated_at?: string; timestamp?: string }[];
  onLoginSuccess?: (res: any) => void;
  onLogout?: () => void;
  user?: any;
  onSelectConversation?: (id: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export function Sidebar({ 
  onOpenSettings, 
  activeView = 'chat', 
  setActiveView, 
  conversations = [],
  onLoginSuccess,
  onLogout,
  user,
  onSelectConversation,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}
      <div className={`absolute z-50 left-0 h-full md:relative md:flex w-[80%] md:w-[25%] bg-bg-sidebar border-r border-border-color flex-col text-text-primary transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
      {/* Profile Section */}
      {user ? (
        <div className="p-6 border-b border-border-color flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-white shrink-0">
              {user.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="text-text-primary font-semibold truncate text-sm">{user.name}</h2>
              <p className="text-xs text-emerald-500 truncate">Online</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-text-muted hover:text-text-primary">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-6 border-b border-border-color flex items-center justify-center">
          <GoogleLogin 
            onSuccess={(res) => onLoginSuccess?.(res)} 
            onError={() => console.log('Login Failed')} 
          />
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          <div 
            onClick={() => {
              setActiveView?.('chat');
              setIsMobileMenuOpen?.(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${
              activeView === 'chat' ? 'bg-bg-panel text-text-primary' : 'hover:bg-bg-panel/50 text-text-secondary hover:text-text-primary'
            }`}
          >
            <MessageSquare className={`w-5 h-5 ${activeView === 'chat' ? 'text-accent' : ''}`} />
            <span className="font-medium">Chats</span>
          </div>
          
          {/* Mapped Conversations */}
          {activeView === 'chat' && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  className="group flex items-center justify-between py-2 px-3 rounded-md hover:bg-bg-panel cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectConversation?.(conv.id);
                    setIsMobileMenuOpen?.(false);
                  }}
                >
                  <span className="text-sm text-text-secondary group-hover:text-text-primary truncate pr-2">{conv.title}</span>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {conv.updated_at ? new Date(conv.updated_at).toLocaleDateString() : conv.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div 
          onClick={() => {
            setActiveView?.('knowledge_base');
            setIsMobileMenuOpen?.(false);
          }}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${
            activeView === 'knowledge_base' ? 'bg-bg-panel text-text-primary' : 'hover:bg-bg-panel/50 text-text-secondary hover:text-text-primary'
          }`}
        >
          <Database className={`w-5 h-5 ${activeView === 'knowledge_base' ? 'text-accent' : ''}`} />
          <span className="font-medium">Knowledge Base</span>
        </div>

        <div 
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
            setIsMobileMenuOpen?.(false);
          }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-panel/50 transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </div>
      </nav>

      {/* Friction Engine Analysis Status */}
      <div className="p-4 border-t border-border-color bg-bg-sidebar transition-colors duration-300">
        <div className="bg-bg-panel rounded-xl p-4 border border-border-color backdrop-blur-sm transition-colors shadow-sm">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center justify-between">
            Friction Engine
            <span className="text-[10px] bg-bg-sidebar px-2 py-0.5 rounded-full text-text-secondary border border-border-color">v1.2</span>
          </h3>
          <div className="flex items-center space-x-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </div>
            <span className="text-sm text-text-primary font-medium">Analysis Active</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
