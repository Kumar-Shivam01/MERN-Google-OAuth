import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const Navigate = useNavigate();
    const [userInfo,setUserInfo] = useState(null);
    useEffect(()=>{
        const data = localStorage.getItem('user-info')
        const userData = JSON.parse(data)
        setUserInfo(userData)
    },[])
    const handleLogout =()=>{
        localStorage.removeItem('user-info')
        Navigate('/login')
    }
    return (
        <div>
            <h1>Welcome {userInfo?.name}</h1>
            <h3>Email: {userInfo?.email}</h3>
            <img src={userInfo?.image} alt={userInfo?.name} />
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
export default Dashboard