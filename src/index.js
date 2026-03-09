import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/variables.css'
import './styles/core.css'
import './styles/animations.css'

// Apply saved theme before first paint (EnviroVision-style light/dark)
const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.body.setAttribute('theme', savedTheme)
  document.documentElement.classList.add(savedTheme)
  document.documentElement.classList.remove(savedTheme === 'dark' ? 'light' : 'dark')
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


