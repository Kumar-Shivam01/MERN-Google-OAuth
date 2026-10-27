import { Link } from 'react-router-dom'
import AppShell from './AppShell'

export default function PageNotFound() {
  return <AppShell><section className="auth-card"><span className="not-found-number" aria-hidden="true">404</span><span className="eyebrow">A SMALL DETOUR</span><h1>Lost your way?</h1><p className="intro">This page isn’t here.<br />Let’s get you somewhere familiar.</p><Link className="google-button home-link" to="/">Back to home <span aria-hidden="true">↗</span></Link></section></AppShell>
}
