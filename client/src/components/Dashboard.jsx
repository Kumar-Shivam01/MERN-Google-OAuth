import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from './AppShell'

export default function Dashboard() {
  const navigate = useNavigate()
  const [imageFailed, setImageFailed] = useState(false)
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user-info')) || {} }
    catch { return {} }
  })
  const handleLogout = () => {
    localStorage.removeItem('user-info')
    navigate('/login', { replace: true })
  }
  return (
    <AppShell action={<button className="text-button" onClick={handleLogout}>Sign out <span aria-hidden="true">↗</span></button>}>
      <section className="auth-card profile-card" aria-labelledby="dashboard-title">
        <span className="session-badge"><span className="status-dot" />You’re signed in</span>
        <div className="avatar">{user.image && !imageFailed ? <img src={user.image} alt="Your profile" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} /> : <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>}</div>
        <span className="eyebrow">MAKE YOURSELF AT HOME</span>
        <h1 id="dashboard-title">Hello, {user.name?.split(' ')[0] || 'there'}.</h1>
        <p className="intro">You’re all set. It’s good to have you here.</p>
        <div className="account-details"><span className="detail-label">YOUR ACCOUNT</span><strong>{user.name || 'Your profile'}</strong><span className="account-email">{user.email}</span><div className="account-provider"><span className="provider-icon" aria-hidden="true">G</span>Connected with Google</div></div>
        <div className="card-footer">Your space. Your account. Just one sign-in.</div>
      </section>
      <p className="below-card">You can sign out anytime.</p>
    </AppShell>
  )
}
