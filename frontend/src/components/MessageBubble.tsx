import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  content: string;
  isSent: boolean;
  time: string;
  modelUsed?: string;
}

export function MessageBubble({ content, isSent, time, modelUsed }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 ${
        isSent
          ? 'bg-bubble-user text-white rounded-br-sm'
          : 'bg-bubble-ai border border-border-color text-text-primary rounded-bl-sm'
        }`}>
        <div className="leading-relaxed text-[15px] tracking-wide markdown-body whitespace-pre-wrap">
          {isSent ? content : <ReactMarkdown>{content}</ReactMarkdown>}
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
