import { useState } from "react"
import './App.css'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import GoogleLogin from './components/GoogleLogin'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GoogleLogin/>}/>
        <Route path="/" element={<Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App