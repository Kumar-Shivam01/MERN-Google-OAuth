import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from '../api'
import { useState } from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
function GoogleLogin(){
    const Navigate = useNavigate()
    const responseGoogle = async (authResult)=>{
        try{
            if(authResult['code']){ 
                const result = await googleAuth(authResult['code'])
                const {email,name,image} = result.data.user;
                const token = result.data.token;
                const obj = {email,name,image,token}
                localStorage.setItem('user-info',JSON.stringify(obj))
                Navigate('/dashboard')
                
            }
        }catch(err){
            const detail = err.response?.data?.error || err.response?.data?.message || err.message
            console.error('Backend login failed:', { status: err.response?.status, message: detail })
        }
    }
    const handleGoogleLogin  = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })
    return( 
        <>
        <h1>Google Login</h1>
        <button onClick={handleGoogleLogin}>Login with Google</button>
        </>
    )
}
export default GoogleLogin
