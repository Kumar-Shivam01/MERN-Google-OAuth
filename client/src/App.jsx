import { useState } from "react"
import './App.css'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import GoogleLogin from './components/GoogleLogin'
import Dashboard from './components/Dashboard'
import PageNotFound from "./components/PageNotFound"
import { GoogleOAuthProvider } from "@react-oauth/google"
import RefreshHandler from "./components/RefreshHandler"
const App = () => {
  const [isAuth,setIsAuth] = useState(false)
  const GoogleAuthWrapper = ()=>{
    return (
      <GoogleOAuthProvider clientId="940190862799-ntnhe3gljmn2d35hp3f4rdet9696m8t8.apps.googleusercontent.com">
        <GoogleLogin/>
      </GoogleOAuthProvider>
    )
  }
  const PrivateRoute = ({element})=>{
    return isAuth? element:<Navigate to='/login'/>
  }
  return (
    <BrowserRouter>
    <RefreshHandler setIsAuth={setIsAuth}/>
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper/>}/>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard/>}/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App