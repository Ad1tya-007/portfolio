import { useState, useRef, useEffect } from 'react';
import {
  getChildrenOfFolder,
  getFolderById,
  getFolderPath,
} from '../data/folders';
import './FolderWindow.css';

function FolderWindow({
  windowId,
  folder,
  initialOffset = 0,
  isActive,
  onClose,
  onFocus,
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentView, setCurrentView] = useState('icon'); // icon, list, column, gallery
  const [currentFolderId, setCurrentFolderId] = useState(folder.id);
  const [navigationHistory, setNavigationHistory] = useState([folder.id]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Window dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: initialOffset,
    y: initialOffset,
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapToTop, setSnapToTop] = useState(false);

  // Window resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: Math.min(window.innerWidth * 0.8, 1200),
    height: Math.min(window.innerHeight * 0.8, 800),
  });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Sidebar resizing state
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(180);

  const windowRef = useRef(null);
  const titlebarRef = useRef(null);
  const snapThreshold = 10; // pixels from top to trigger snap

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setSnapToTop(false);
    } else {
      setIsMaximized(true);
      setSnapToTop(false);
    }
  };

  // Window dragging
  const handleMouseDown = (e) => {
    // Bring window to front
    onFocus();

    // Disable dragging on tablet and mobile
    if (window.innerWidth <= 1024) return;

    if (
      e.target === titlebarRef.current ||
      titlebarRef.current?.contains(e.target)
    ) {
      // Don't drag if clicking on window controls
      if (e.target.closest('.window-controls')) return;

      // If maximized, un-maximize on drag start
      if (isMaximized) {
        setIsMaximized(false);
        const newX = e.clientX - windowSize.width / 2;
        setPosition({ x: newX, y: 0 });
        setDragOffset({
          x: windowSize.width / 2,
          y: e.clientY,
        });
      } else {
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }

      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Check if near top for snap indicator
      if (newY <= snapThreshold) {
        setSnapToTop(true);
      } else {
        setSnapToTop(false);
      }

      // Keep window within viewport
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 100;

      setPosition({
        x: Math.max(-windowSize.width + 200, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      });
    }

    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      const newWidth = Math.max(400, resizeStart.width + deltaX);
      const newHeight = Math.max(300, resizeStart.height + deltaY);

      setWindowSize({ width: newWidth, height: newHeight });
    }

    if (isResizingSidebar) {
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(120, Math.min(300, e.clientX - rect.left));
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    // Check if we should snap to fullscreen
    if (isDragging && snapToTop) {
      setIsMaximized(true);
      setSnapToTop(false);
    }

    setIsDragging(false);
    setIsResizing(false);
    setIsResizingSidebar(false);
  };

  useEffect(() => {
    if (isDragging || isResizing || isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    isDragging,
    isResizing,
    isResizingSidebar,
    dragOffset,
    resizeStart,
    windowSize,
  ]);

  // Window resize handlers
  const handleResizeStart = (e) => {
    if (isMaximized) return;
    // Disable resizing on tablet and mobile
    if (window.innerWidth <= 1024) return;
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height,
    });
  };

  // Sidebar resize handler
  const handleSidebarResizeStart = (e) => {
    // Disable sidebar resize on tablet and mobile
    if (window.innerWidth <= 1024) return;
    e.preventDefault();
    setIsResizingSidebar(true);
  };

  // Get window style
  const getWindowStyle = () => {
    const baseStyle = {
      zIndex: isActive ? 1002 : 1001,
    };

    if (isMaximized) {
      return {
        ...baseStyle,
        width: '100vw',
        height: 'calc(100vh - 24px)',
        top: '24px',
        left: '0',
        transform: 'none',
        borderRadius: '0',
      };
    }

    return {
      ...baseStyle,
      width: `${windowSize.width}px`,
      height: `${windowSize.height}px`,
      top: position.y !== 0 || position.x !== 0 ? `${position.y}px` : '50%',
      left: position.x !== 0 || position.y !== 0 ? `${position.x}px` : '50%',
      transform:
        position.x !== 0 || position.y !== 0 ? 'none' : 'translate(-50%, -50%)',
    };
  };

  // Get current folder data
  const currentFolder = getFolderById(currentFolderId);
  const contents = getChildrenOfFolder(currentFolderId);
  const currentPath = getFolderPath(currentFolderId);

  // Navigation handlers
  const navigateToFolder = (folderId) => {
    setCurrentFolderId(folderId);
    // Add to history
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(navigationHistory[newIndex]);
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(navigationHistory[newIndex]);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      // Handle file opening (can be implemented later)
      console.log('Opening file:', item.name);
    }
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    }
  };

  return (
    <>
      {/* Snap indicator overlay */}
      {snapToTop && <div className="snap-indicator" />}

      <div
        ref={windowRef}
        className={`folder-window ${isMaximized ? 'maximized' : ''} ${
          isDragging ? 'dragging' : ''
        } ${isResizing ? 'resizing' : ''} ${isActive ? 'active' : ''}`}
        style={getWindowStyle()}
        onMouseDown={onFocus}>
        <div
          ref={titlebarRef}
          className="window-titlebar"
          onMouseDown={handleMouseDown}>
          <div className="window-controls">
            <div className="window-control close" onClick={onClose}></div>
            <div className="window-control minimize" onClick={onClose}></div>
            <div
              className="window-control maximize"
              onClick={handleMaximize}></div>
          </div>
          <div className="window-title">
            {currentFolder?.name || folder.name}
          </div>
        </div>
        <div className="window-toolbar">
          <div className="toolbar-buttons">
            <button
              className="toolbar-btn"
              onClick={navigateBack}
              disabled={historyIndex === 0}>
              ←
            </button>
            <button
              className="toolbar-btn"
              onClick={navigateForward}
              disabled={historyIndex === navigationHistory.length - 1}>
              →
            </button>
          </div>
          <div className="toolbar-center">{currentPath}</div>
          <div className="toolbar-right">
            <button
              className={`view-btn ${currentView === 'icon' ? 'active' : ''}`}
              onClick={() => setCurrentView('icon')}
              title="Icon view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => setCurrentView('list')}
              title="List view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line
                  x1="4"
                  y1="6"
                  x2="20"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="4"
                  y1="12"
                  x2="20"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="4"
                  y1="18"
                  x2="20"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className={`view-btn ${currentView === 'column' ? 'active' : ''}`}
              onClick={() => setCurrentView('column')}
              title="Column view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="18"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="18"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              className={`view-btn ${
                currentView === 'gallery' ? 'active' : ''
              }`}
              onClick={() => setCurrentView('gallery')}
              title="Gallery view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="3"
                  y1="9"
                  x2="21"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="window-main">
          <div
            className="window-sidebar"
            style={{ width: `${sidebarWidth}px` }}>
            <div className="sidebar-section">
              <div className="sidebar-title">Favorites</div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>AirDrop</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Recents</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Applications</span>
              </div>
              <div className="sidebar-item active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Desktop</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Documents</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Downloads</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>adi</span>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-title">iCloud</div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>iCloud Drive</span>
              </div>
              <div className="sidebar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Shared</span>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-title">Tags</div>
              <div className="sidebar-item">
                <span className="tag-dot red"></span>
                <span>Red</span>
              </div>
              <div className="sidebar-item">
                <span className="tag-dot orange"></span>
                <span>Orange</span>
              </div>
              <div className="sidebar-item">
                <span className="tag-dot yellow"></span>
                <span>Yellow</span>
              </div>
            </div>
            <div
              className="sidebar-resize-handle"
              onMouseDown={handleSidebarResizeStart}
            />
          </div>
          <div className="window-content">
            {contents.length > 0 ? (
              <div className={`content-grid ${currentView}`}>
                {contents.map((item) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    view={currentView}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="placeholder-content">
                <p className="placeholder-icon">📄</p>
                <p>This folder is empty</p>
                <p className="placeholder-subtitle">
                  Add content to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Window resize handles */}
        {!isMaximized && (
          <>
            <div
              className="resize-handle resize-right"
              onMouseDown={handleResizeStart}
            />
            <div
              className="resize-handle resize-bottom"
              onMouseDown={handleResizeStart}
            />
            <div
              className="resize-handle resize-corner"
              onMouseDown={handleResizeStart}
            />
          </>
        )}
      </div>
    </>
  );
}

// Separate component for content items with touch support
function ContentItem({ item, view, onClick, onDoubleClick }) {
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);
  const [isSelected, setIsSelected] = useState(false);

  // Handle touch events for mobile double-tap
  const handleTouchEnd = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Double tap detected (within 300ms)
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      onDoubleClick();
      lastTapRef.current = 0;
    } else {
      // Single tap
      tapTimeoutRef.current = setTimeout(() => {
        onClick();
        setIsSelected(true);
        lastTapRef.current = 0;
      }, 300);
      lastTapRef.current = currentTime;
    }
  };

  // Handle mouse events for desktop
  const handleClick = (e) => {
    if (e.type === 'click' && !('ontouchstart' in window)) {
      onClick();
      setIsSelected(true);
    }
  };

  const handleDoubleClick = (e) => {
    if (e.type === 'dblclick' && !('ontouchstart' in window)) {
      onDoubleClick();
    }
  };

  // Get icon based on file type
  const getIcon = () => {
    if (item.type === 'folder') {
      return (
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
            fill="currentColor"
          />
        </svg>
      );
    }

    // File icons
    return (
      <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"
          fill="currentColor"
        />
      </svg>
    );
  };

  return (
    <div
      className={`content-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}>
      <div className="item-icon">{getIcon()}</div>
      <div className="item-name">{item.name}</div>
    </div>
  );
}

export default FolderWindow;
