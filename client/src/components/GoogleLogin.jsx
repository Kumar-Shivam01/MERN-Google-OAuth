import { useGoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleAuth } from '../api'
import AppShell from './AppShell'

function GoogleIcon() {
  return <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20.4 20.4 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.2H5.8a20 20 0 0 0 0 17.6l6.8-5.2Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.8A19.7 19.7 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15.2l6.8 5.2C14.2 15.6 18.7 12 24 12Z"/></svg>
}

export default function GoogleLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleError = (result) => {
    setLoading(false)
    setError(result.type === 'popup_closed' ? 'Sign-in was closed. You can try again whenever you’re ready.' : 'Couldn’t open Google sign-in. Please try again.')
  }
  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onError: handleError,
    onNonOAuthError: handleError,
    onSuccess: async ({ code }) => {
      try {
        const { data } = await googleAuth(code)
        const { email, name, image } = data.user
        localStorage.setItem('user-info', JSON.stringify({ email, name, image, token: data.token }))
        navigate('/dashboard')
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'We couldn’t finish signing you in. Please try again.')
        setLoading(false)
      }
    },
  })
  return (
    <AppShell>
      <section className="auth-card" aria-labelledby="login-title">
        <div className="welcome-symbol" aria-hidden="true">✳</div>
        <span className="eyebrow">YOUR SPACE, ONE SIGN-IN AWAY</span>
        <h1 id="login-title">Good to see you.</h1>
        <p className="intro">A little less friction.<br />A little more possibility.</p>
        <button className="google-button" disabled={loading} onClick={() => { setError(''); setLoading(true); handleGoogleLogin() }}>
          {loading ? <span className="spinner" aria-hidden="true" /> : <GoogleIcon />}
          {loading ? 'Signing you in…' : 'Continue with Google'}
          {!loading && <span className="button-arrow" aria-hidden="true">↗</span>}
        </button>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="sign-in-note"><span className="status-dot" />No extra password to remember.</div>
        <div className="card-footer">New here? Your account is created when you sign in.</div>
      </section>
      <p className="below-card">One account. A simpler start.</p>
    </AppShell>
  )
}
