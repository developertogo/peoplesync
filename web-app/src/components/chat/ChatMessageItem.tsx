import React from 'react';
import { ChatMessage } from '../../store/peopleStore';

interface ChatMessageItemProps {
  msg: ChatMessage;
  isDarkMode: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  isDarkMode
}) => {
  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
          msg.sender === 'user'
            ? 'bg-gradient-to-r from-primary to-accent text-white rounded-tr-none font-medium'
            : `rounded-tl-none border ${isDarkMode ? 'bg-slate-900 border-slate-800/60 text-slate-205' : 'bg-slate-100 border-slate-205 text-slate-808'}`
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};
