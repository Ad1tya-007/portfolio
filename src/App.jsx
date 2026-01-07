import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import LoadingScreen from './components/LoadingScreen'
import Desktop from './components/Desktop'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome') // welcome, loading, desktop

  const handleStart = () => {
    setCurrentScreen('loading')
    setTimeout(() => {
      setCurrentScreen('desktop')
    }, 3000)
  }

  return (
    <div className="app">
      <WelcomeScreen active={currentScreen === 'welcome'} onStart={handleStart} />
      <LoadingScreen active={currentScreen === 'loading'} />
      <Desktop active={currentScreen === 'desktop'} />
    </div>
  )
}

export default App

