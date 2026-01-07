import { useState, useEffect } from 'react'
import MenuBar from './MenuBar'
import Folder from './Folder'
import Dock from './Dock'
import FolderWindow from './FolderWindow'
import { getRootFolders } from '../data/folders'
import './Desktop.css'

function Desktop({ active }) {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [openWindows, setOpenWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const [folderPositions, setFolderPositions] = useState([])
  const [nextWindowId, setNextWindowId] = useState(1)

  const rootFolders = getRootFolders()

  // Calculate responsive folder positions
  useEffect(() => {
    const calculatePositions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Desktop: right side vertical layout
      if (width > 1024) {
        const startX = width - 140
        const startY = 80
        const spacing = 120
        return rootFolders.map((folder, index) => ({
          ...folder,
          x: startX,
          y: startY + (index * spacing)
        }))
      }
      // Tablet: right side with tighter spacing
      else if (width > 768) {
        const startX = width - 120
        const startY = 60
        const spacing = 100
        return rootFolders.map((folder, index) => ({
          ...folder,
          x: startX,
          y: startY + (index * spacing)
        }))
      }
      // Mobile: grid layout at top
      else {
        const startX = 20
        const startY = 20
        const spacingX = 90
        const spacingY = 100
        const itemsPerRow = width < 480 ? 3 : 4
        
        return rootFolders.map((folder, index) => ({
          ...folder,
          x: startX + (index % itemsPerRow) * spacingX,
          y: startY + Math.floor(index / itemsPerRow) * spacingY
        }))
      }
    }

    setFolderPositions(calculatePositions())

    const handleResize = () => {
      setFolderPositions(calculatePositions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [rootFolders])

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId)
  }

  const handleFolderDoubleClick = (folder) => {
    // Check if window is already open for this folder
    const existingWindow = openWindows.find(w => w.folder.id === folder.id)
    
    if (existingWindow) {
      // Bring existing window to front
      setActiveWindowId(existingWindow.id)
    } else {
      // Create new window with offset position
      const windowId = nextWindowId
      const offset = (openWindows.length % 5) * 30 // Cascade windows
      
      const newWindow = {
        id: windowId,
        folder: folder,
        initialOffset: offset
      }
      
      setOpenWindows([...openWindows, newWindow])
      setActiveWindowId(windowId)
      setNextWindowId(nextWindowId + 1)
    }
  }

  const handleCloseWindow = (windowId) => {
    setOpenWindows(openWindows.filter(w => w.id !== windowId))
    if (activeWindowId === windowId) {
      const remaining = openWindows.filter(w => w.id !== windowId)
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
    }
  }

  const handleWindowFocus = (windowId) => {
    setActiveWindowId(windowId)
  }

  return (
    <div className={`screen desktop ${active ? 'active' : ''}`}>
      <MenuBar />
      
      <div className="desktop-area">
        {folderPositions.map(folder => (
          <Folder
            key={folder.id}
            folder={folder}
            isSelected={selectedFolder === folder.id}
            onClick={() => handleFolderClick(folder.id)}
            onDoubleClick={() => handleFolderDoubleClick(folder)}
          />
        ))}
      </div>

      <Dock />

      {openWindows.map((window) => (
        <FolderWindow
          key={window.id}
          windowId={window.id}
          folder={window.folder}
          initialOffset={window.initialOffset}
          isActive={activeWindowId === window.id}
          onClose={() => handleCloseWindow(window.id)}
          onFocus={() => handleWindowFocus(window.id)}
        />
      ))}
    </div>
  )
}

export default Desktop

