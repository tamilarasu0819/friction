import React from 'react';

interface MessageBubbleProps {
  content: string;
  isSent: boolean;
  time: string;
}

export function MessageBubble({ content, isSent, time }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-5 py-3 shadow-sm ${
        isSent 
          ? 'bg-blue-600 text-white rounded-br-sm' 
          : 'bg-slate-700 text-slate-100 rounded-bl-sm'
      }`}>
        <p className="leading-relaxed text-[15px]">{content}</p>
        <div className={`text-[11px] mt-1.5 font-medium ${isSent ? 'text-blue-200' : 'text-slate-400'} ${isSent ? 'text-right' : 'text-left'}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
