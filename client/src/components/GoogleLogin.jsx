import {useGoogleLogin} from '@react-oauth/google'
function GoogleLogin(){
    const responseGoogle = async (authResult)=>{
        try{
            console.log(authResult)
        }catch(err){
            console.log(err)
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