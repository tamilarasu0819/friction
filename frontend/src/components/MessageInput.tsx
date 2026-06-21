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
    <div className="p-4 sm:p-6 bg-header backdrop-blur-md border-t border-border-color z-10 w-full shrink-0 transition-colors duration-300">
      <div className="flex items-center space-x-3 max-w-4xl mx-auto">
        <button className="p-3 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-full transition-colors shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Message Friction AI..."
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`w-full bg-bg-panel border border-border-color rounded-2xl py-4 px-6 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-text-muted shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <button className="p-3 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-full transition-colors shrink-0">
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={onSend}
          disabled={disabled || value.trim() === ''}
          className={`p-4 bg-accent hover:bg-accent-hover text-accent-fg rounded-2xl transition-all flex items-center justify-center font-medium shadow-md hover:shadow-lg active:scale-95 shrink-0 ${disabled || value.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
