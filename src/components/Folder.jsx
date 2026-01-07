import { useRef } from 'react';
import './Folder.css';

function Folder({ folder, isSelected, onClick, onDoubleClick }) {
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  // Handle touch events for mobile double-tap
  const handleTouchEnd = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    // Clear any existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Double tap detected (within 300ms)
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      onDoubleClick();
      lastTapRef.current = 0;
    } else {
      // Single tap - wait to see if there's a second tap
      tapTimeoutRef.current = setTimeout(() => {
        onClick();
        lastTapRef.current = 0;
      }, 300);
      lastTapRef.current = currentTime;
    }
  };

  // Handle mouse events for desktop
  const handleClick = (e) => {
    // Only handle click if not a touch device
    if (e.type === 'click' && !('ontouchstart' in window)) {
      onClick();
    }
  };

  const handleDoubleClick = (e) => {
    // Only handle double-click if not a touch device
    if (e.type === 'dblclick' && !('ontouchstart' in window)) {
      onDoubleClick();
    }
  };

  return (
    <div
      className={`folder ${isSelected ? 'selected' : ''}`}
      style={{ position: 'absolute', left: `${folder.x}px`, top: `${folder.y}px` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
    >
      <div className="folder-icon">
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" fill="currentColor"/>
        </svg>
      </div>
      <div className="folder-name">{folder.name}</div>
    </div>
  );
}

export default Folder;

