import React from 'react';
import { MessageSquare, Database, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-[25%] h-full bg-slate-900 border-r border-slate-700 flex flex-col text-slate-300">
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
          V
        </div>
        <div className="min-w-0">
          <h2 className="text-white font-semibold truncate">Vikram</h2>
          <p className="text-sm text-emerald-400 truncate">Online</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 text-white cursor-pointer">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          <span className="font-medium">Chats</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-white">
          <Database className="w-5 h-5" />
          <span className="font-medium">Knowledge Base</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-white">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </div>
      </nav>

      {/* Friction Engine Analysis Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            Friction Engine
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">v1.2</span>
          </h3>
          <div className="flex items-center space-x-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <span className="text-sm text-slate-300 font-medium">Analysis Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
