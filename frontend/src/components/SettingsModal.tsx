import { useTheme } from '../context/ThemeContext';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  { id: 'default', name: 'Current / Default', colors: ['#0f172a', '#1e293b', '#60a5fa'] },
  { id: 'dark', name: 'Dark', colors: ['#111827', '#1f2937', '#818cf8'] },
  { id: 'black', name: 'Full Black', colors: ['#000000', '#18181b', '#f4f4f5'] },
  { id: 'glossy-blue', name: 'Glossy Light Blue', colors: ['#f0f9ff', '#ffffff', '#0ea5e9'] },
  { id: 'white', name: 'White', colors: ['#ffffff', '#f9fafb', '#111827'] },
  { id: 'gray', name: 'Gray', colors: ['#f1f5f9', '#ffffff', '#475569'] }
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[8px] animate-in fade-in duration-200">
      <div className="bg-bg-panel w-full max-w-md rounded-2xl shadow-xl border border-border-color overflow-hidden">
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
                onMouseEnter={() => document.documentElement.setAttribute('data-theme', t.id)}
                onMouseLeave={() => document.documentElement.setAttribute('data-theme', theme)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  theme === t.id 
                    ? 'border-accent bg-accent/10 text-text-primary' 
                    : 'border-border-color hover:border-text-muted text-text-secondary hover:bg-bg-app'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{t.name}</span>
                  <div className="flex items-center -space-x-1">
                    {t.colors.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-4 h-4 rounded-full border border-border-color shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {theme === t.id && <Check className="w-5 h-5 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
