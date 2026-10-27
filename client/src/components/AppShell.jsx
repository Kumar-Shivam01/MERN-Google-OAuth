import { Link } from 'react-router-dom'

export default function AppShell({ children, action }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="One home"><span className="brand-mark" aria-hidden="true">✳</span>one<span className="brand-period">.</span></Link>
        {action || <span className="header-caption">A simpler way in.</span>}
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer"><span>Made for a smoother everyday.</span><span className="footer-detail">Simple by design <span aria-hidden="true">↗</span></span></footer>
    </div>
  )
}
