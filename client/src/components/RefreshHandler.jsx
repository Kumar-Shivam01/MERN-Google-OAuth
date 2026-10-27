import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

function RefreshHandler({setIsAuth}){
    const Navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        const data = localStorage.getItem('user-info')
        const token = JSON.parse(data)?.token;
        if(token){
            setIsAuth(true)
            if(location.pathname === '/' || location.pathname === '/login'){
                Navigate('/dashboard',{replace: false})
            }

        }
    },[location,Navigate,setIsAuth])
    return null
}
export default RefreshHandler