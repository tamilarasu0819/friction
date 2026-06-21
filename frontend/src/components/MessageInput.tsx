import { Paperclip, Smile, Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
      <div className="flex items-center space-x-3 max-w-5xl mx-auto">
        <button className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type your message..."
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`w-full bg-slate-800 border border-slate-700 rounded-full py-3.5 px-6 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <button className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors shrink-0">
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={onSend}
          disabled={disabled}
          className={`p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all flex items-center justify-center font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
