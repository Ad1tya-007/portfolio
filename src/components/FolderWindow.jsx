import { useState } from 'react'
import './FolderWindow.css'

function FolderWindow({ folder, onClose }) {
  const [isMaximized, setIsMaximized] = useState(false)

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  return (
    <div className={`folder-window ${isMaximized ? 'maximized' : ''}`}>
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control close" onClick={onClose}></div>
          <div className="window-control minimize" onClick={onClose}></div>
          <div className="window-control maximize" onClick={handleMaximize}></div>
        </div>
        <div className="window-title">{folder.name}</div>
      </div>
      <div className="window-toolbar">
        <div className="toolbar-buttons">
          <button className="toolbar-btn">←</button>
          <button className="toolbar-btn">→</button>
        </div>
        <div className="window-path">{folder.name}</div>
      </div>
      <div className="window-content">
        <div className="placeholder-content">
          <p className="placeholder-icon">📄</p>
          <p>This folder is ready for your content</p>
          <p className="placeholder-subtitle">Text files will be added here</p>
        </div>
      </div>
    </div>
  )
}

export default FolderWindow

