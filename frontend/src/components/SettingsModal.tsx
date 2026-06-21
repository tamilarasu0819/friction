import { useTheme } from '../context/ThemeContext';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  { id: 'default', name: 'Current / Default' },
  { id: 'dark', name: 'Dark' },
  { id: 'black', name: 'Full Black' },
  { id: 'glossy-blue', name: 'Glossy Light Blue' },
  { id: 'white', name: 'White' },
  { id: 'gray', name: 'Gray' }
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-panel w-full max-w-md rounded-2xl shadow-xl border border-border-color overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-header">
          <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg-app text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Theme Selection</h3>
          <div className="space-y-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  theme === t.id 
                    ? 'border-accent bg-accent/10 text-text-primary' 
                    : 'border-border-color hover:border-text-muted text-text-secondary hover:bg-bg-app'
                }`}
              >
                <span className="font-medium">{t.name}</span>
                {theme === t.id && <Check className="w-5 h-5 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
