import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isSent: boolean;
  time: string;
  modelUsed?: string;
}

export function MessageBubble({ content, isSent, time, modelUsed }: MessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 relative ${
        isSent
          ? 'bg-bubble-user text-white rounded-br-sm'
          : 'bg-bubble-ai border border-border-color text-text-primary rounded-bl-sm'
        }`}>
        
        {!isSent && (
          <button 
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-bg-panel border border-border-color text-text-secondary hover:text-text-primary hover:bg-bg-app transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
            title="Copy message"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}

        <div className={`leading-relaxed text-[15px] tracking-wide markdown-body whitespace-pre-wrap overflow-hidden ${!isSent ? 'mt-4' : ''}`}>
          {isSent ? content : (
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md my-4 !bg-[#1e1e1e] border border-border-color shadow-sm !text-[13px]"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-text-primary/10 text-accent px-1.5 py-0.5 rounded-md text-[13px] font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        <div className={`mt-3 flex items-center justify-${isSent ? 'end' : 'start'} gap-2 opacity-60 group-hover:opacity-100 transition-opacity`}>
          {!isSent && modelUsed && (
            <span className="text-[10px] font-medium bg-text-primary/10 text-text-primary px-2 py-0.5 rounded-full border border-text-primary/10">
              Model: {modelUsed}
            </span>
          )}
          <span className={`text-[11px] font-medium ${isSent ? 'text-white/80' : 'text-text-secondary'}`}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
