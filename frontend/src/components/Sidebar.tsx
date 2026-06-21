import { MessageSquare, Database, Settings } from 'lucide-react';

interface SidebarProps {
  onOpenSettings?: () => void;
  activeView?: 'chat' | 'knowledge_base';
  setActiveView?: (view: 'chat' | 'knowledge_base') => void;
  conversations?: { id: string; title: string; timestamp: string }[];
}

export function Sidebar({ onOpenSettings, activeView = 'chat', setActiveView, conversations = [] }: SidebarProps) {
  return (
    <div className="w-[25%] h-full bg-bg-sidebar border-r border-border-color flex flex-col text-text-primary transition-colors duration-300 z-20">
      {/* Profile Section */}
      <div className="p-6 border-b border-border-color flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-bg-panel flex items-center justify-center font-bold text-text-primary shrink-0 transition-colors">
          V
        </div>
        <div className="min-w-0">
          <h2 className="text-text-primary font-semibold truncate">Vikram</h2>
          <p className="text-sm text-emerald-500 truncate">Online</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          <div 
            onClick={() => setActiveView?.('chat')}
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
                  onClick={() => console.log('Clear/reload chat', conv.id)}
                >
                  <span className="text-sm text-text-secondary group-hover:text-text-primary truncate pr-2">{conv.title}</span>
                  <span className="text-[10px] text-text-muted shrink-0">{conv.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div 
          onClick={() => setActiveView?.('knowledge_base')}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${
            activeView === 'knowledge_base' ? 'bg-bg-panel text-text-primary' : 'hover:bg-bg-panel/50 text-text-secondary hover:text-text-primary'
          }`}
        >
          <Database className={`w-5 h-5 ${activeView === 'knowledge_base' ? 'text-accent' : ''}`} />
          <span className="font-medium">Knowledge Base</span>
        </div>

        <div 
          onClick={onOpenSettings}
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
  );
}
