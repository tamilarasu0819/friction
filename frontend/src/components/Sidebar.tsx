import { MessageSquare, Database, Settings } from 'lucide-react';

interface SidebarProps {
  onOpenSettings?: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-panel text-text-primary cursor-pointer transition-colors shadow-sm">
          <MessageSquare className="w-5 h-5 text-accent" />
          <span className="font-medium">Chats</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-panel transition-colors cursor-pointer text-text-secondary hover:text-text-primary">
          <Database className="w-5 h-5" />
          <span className="font-medium">Knowledge Base</span>
        </div>
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-panel transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
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
