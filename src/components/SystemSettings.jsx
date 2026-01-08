import { useState, useRef, useEffect } from 'react';
import './SystemSettings.css';

function SystemSettings({ onClose, appearance, setAppearance, wallpaper, setWallpaper }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedSetting, setSelectedSetting] = useState('appearance');
  
  const windowRef = useRef(null);
  const titlebarRef = useRef(null);

  // Window dragging
  const handleMouseDown = (e) => {
    if (window.innerWidth <= 1024) return;

    if (e.target === titlebarRef.current || titlebarRef.current?.contains(e.target)) {
      if (e.target.closest('.window-controls')) return;

      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;

    setPosition({
      x: Math.max(-800 + 200, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
  }, [isDragging, dragOffset]);

  const getWindowStyle = () => {
    return {
      width: '800px',
      height: '600px',
      top: position.y || '50%',
      left: position.x || '50%',
      transform: position.x || position.y ? 'none' : 'translate(-50%, -50%)',
    };
  };

  const settingsItems = [
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'wallpaper', name: 'Wallpaper', icon: '🖼️' },
    { id: 'desktop', name: 'Desktop & Dock', icon: '💻' },
    { id: 'displays', name: 'Displays', icon: '🖥️' },
  ];

  const wallpapers = [
    { id: 'gradient-blue', name: 'Blue Gradient', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)' },
    { id: 'gradient-purple', name: 'Purple Gradient', gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a78bfa 100%)' },
    { id: 'gradient-orange', name: 'Orange Gradient', gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)' },
    { id: 'gradient-green', name: 'Green Gradient', gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)' },
    { id: 'gradient-pink', name: 'Pink Gradient', gradient: 'linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)' },
    { id: 'monterey', name: 'Monterey', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e40af 30%, #7c3aed 60%, #ec4899 100%)' },
  ];

  return (
    <div
      ref={windowRef}
      className={`settings-window settings-window-${appearance} ${isDragging ? 'dragging' : ''}`}
      style={getWindowStyle()}
      data-appearance={appearance}
    >
      <div ref={titlebarRef} className="settings-titlebar" onMouseDown={handleMouseDown}>
        <div className="window-controls">
          <div className="window-control close" onClick={onClose}></div>
          <div className="window-control minimize" onClick={onClose}></div>
          <div className="window-control maximize"></div>
        </div>
        <div className="settings-title">System Settings</div>
      </div>

      <div className="settings-main">
        <div className="settings-sidebar">
          <input
            type="text"
            className="settings-search"
            placeholder="Search"
          />
          
          <div className="settings-list">
            {settingsItems.map((item) => (
              <div
                key={item.id}
                className={`settings-item ${selectedSetting === item.id ? 'active' : ''}`}
                onClick={() => setSelectedSetting(item.id)}
              >
                <span className="settings-icon">{item.icon}</span>
                <span className="settings-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-content">
          {selectedSetting === 'appearance' && (
            <div className="appearance-settings">
              <h2>Appearance</h2>
              
              <div className="appearance-section">
                <div className="appearance-options">
                  <div
                    className={`appearance-option ${appearance === 'light' ? 'selected' : ''}`}
                    onClick={() => setAppearance('light')}
                  >
                    <div className="appearance-preview light">
                      <div className="preview-window">
                        <div className="preview-titlebar"></div>
                        <div className="preview-content"></div>
                      </div>
                    </div>
                    <span>Light</span>
                  </div>

                  <div
                    className={`appearance-option ${appearance === 'dark' ? 'selected' : ''}`}
                    onClick={() => setAppearance('dark')}
                  >
                    <div className="appearance-preview dark">
                      <div className="preview-window">
                        <div className="preview-titlebar"></div>
                        <div className="preview-content"></div>
                      </div>
                    </div>
                    <span>Dark</span>
                  </div>

                  <div
                    className={`appearance-option ${appearance === 'auto' ? 'selected' : ''}`}
                    onClick={() => setAppearance('auto')}
                  >
                    <div className="appearance-preview auto">
                      <div className="preview-window">
                        <div className="preview-titlebar"></div>
                        <div className="preview-content"></div>
                      </div>
                    </div>
                    <span>Auto</span>
                  </div>
                </div>
              </div>

              <div className="settings-info">
                <p>Change the appearance of buttons, menus, and windows throughout the system.</p>
              </div>
            </div>
          )}

          {selectedSetting === 'wallpaper' && (
            <div className="wallpaper-settings">
              <h2>Wallpaper</h2>
              
              <div className="wallpaper-section">
                <div className="wallpaper-grid">
                  {wallpapers.map((wp) => (
                    <div
                      key={wp.id}
                      className={`wallpaper-option ${wallpaper === wp.id ? 'selected' : ''}`}
                      onClick={() => setWallpaper(wp.id)}
                    >
                      <div 
                        className="wallpaper-preview"
                        style={{ background: wp.gradient }}
                      ></div>
                      <span className="wallpaper-name">{wp.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-info">
                <p>Choose a wallpaper for your desktop background.</p>
              </div>
            </div>
          )}

          {selectedSetting !== 'appearance' && selectedSetting !== 'wallpaper' && (
            <div className="placeholder-settings">
              <h2>{settingsItems.find(i => i.id === selectedSetting)?.name}</h2>
              <p>Settings for {settingsItems.find(i => i.id === selectedSetting)?.name} will be added here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
