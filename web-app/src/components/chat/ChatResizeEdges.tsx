import React from 'react';

interface ChatResizeEdgesProps {
  startResizingChat: (e: React.MouseEvent, dir: string) => void;
  isDarkMode: boolean;
}

export const ChatResizeEdges: React.FC<ChatResizeEdgesProps> = ({
  startResizingChat,
  isDarkMode
}) => {
  return (
    <>
      {/* Edges */}
      <div
        onMouseDown={(e) => startResizingChat(e, 'n')}
        className="absolute -top-1 left-3 right-3 h-3 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 's')}
        className="absolute -bottom-1.5 left-0 right-0 h-4 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 'e')}
        className="absolute top-3 bottom-3 -right-1 w-3 cursor-ew-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 'w')}
        className="absolute top-3 bottom-3 -left-1 w-3 cursor-ew-resize z-50 hover:bg-primary/30 transition-colors"
      />
      {/* Corners */}
      <div
        onMouseDown={(e) => startResizingChat(e, 'nw')}
        className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 'ne')}
        className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 'sw')}
        className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-50 hover:bg-primary/30 transition-colors"
      />
      <div
        onMouseDown={(e) => startResizingChat(e, 'se')}
        className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-50 hover:bg-primary/30 transition-colors"
      />

      {/* Bottom Right Resize Grip Visual Indicator */}
      <div className="absolute bottom-1 right-1 pointer-events-none z-30">
        <svg width="10" height="10" viewBox="0 0 10 10" className={`w-2.5 h-2.5 ${isDarkMode ? 'text-slate-550' : 'text-slate-400'}`}>
          <line x1="8" y1="10" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="10" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2" y1="10" x2="10" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
};
