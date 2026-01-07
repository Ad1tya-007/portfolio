import './WelcomeScreen.css'

function WelcomeScreen({ active, onStart }) {
  return (
    <div className={`screen welcome-screen ${active ? 'active' : ''}`}>
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome</h1>
        <button className="start-button" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen

