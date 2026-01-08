import { useRef, useState, useEffect } from 'react';
import './Folder.css';

function Folder({ folder, isSelected, onClick, onDoubleClick, onDragEnd }) {
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: folder.x, y: folder.y });

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

  // Update position when folder prop changes
  useEffect(() => {
    setPosition({ x: folder.x, y: folder.y });
  }, [folder.x, folder.y]);

  // Handle mouse events for desktop
  const handleClick = (e) => {
    // Only handle click if not a touch device and not dragging
    if (e.type === 'click' && !('ontouchstart' in window) && !isDragging) {
      onClick();
    }
  };

  const handleDoubleClick = (e) => {
    // Only handle double-click if not a touch device
    if (e.type === 'dblclick' && !('ontouchstart' in window)) {
      onDoubleClick();
    }
  };

  // Folder dragging (desktop only)
  const handleMouseDown = (e) => {
    // Only allow dragging on desktop (> 1024px)
    if (window.innerWidth <= 1024) return;
    
    // Don't start drag on double click
    if (e.detail === 2) return;

    e.preventDefault();
    setIsDragging(true);
    
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep folder within viewport
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    setPosition({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(24, Math.min(maxY, newY)) // 24px for menu bar
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save the new position
      if (onDragEnd) {
        onDragEnd(folder.id, position.x, position.y);
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, position]);

  return (
    <div
      className={`folder ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        position: 'absolute', 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: window.innerWidth > 1024 ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
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

