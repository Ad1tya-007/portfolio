import { useState, useEffect } from 'react'
import MenuBar from './MenuBar'
import Folder from './Folder'
import Dock from './Dock'
import FolderWindow from './FolderWindow'
import './Desktop.css'

function Desktop({ active }) {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [openFolder, setOpenFolder] = useState(null)
  const [folderPositions, setFolderPositions] = useState([])

  const folders = [
    { id: 'about', name: 'About Me' },
    { id: 'projects', name: 'Projects' },
    { id: 'skills', name: 'Skills' },
    { id: 'experience', name: 'Experience' },
    { id: 'contact', name: 'Contact' }
  ]

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
        return folders.map((folder, index) => ({
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
        return folders.map((folder, index) => ({
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
        
        return folders.map((folder, index) => ({
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
  }, [])

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId)
  }

  const handleFolderDoubleClick = (folder) => {
    setOpenFolder(folder)
  }

  const handleCloseWindow = () => {
    setOpenFolder(null)
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

      {openFolder && (
        <FolderWindow
          folder={openFolder}
          onClose={handleCloseWindow}
        />
      )}
    </div>
  )
}

export default Desktop

