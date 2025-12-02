import { useState } from 'react'
import './css/app.css'
import {Route, Routes} from 'react-router-dom'
import Login from './components/Login.jsx'
import Setup from './components/Setup.jsx'
import Confirm from "./components/Confirm.jsx"
import Quiz from "./components/Quiz.jsx"
import Results from "./components/Results.jsx"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}

export default App
