import { useState } from 'react'
import { Icon } from './Icon'

export function LoginPage({ onSignIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter your username and password to continue.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      await onSignIn(username.trim(), password)
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><span className="brand-mark"><Icon name="spark" size={24} /></span><span>PolicyPilot</span></div>
        <p className="eyebrow">Secure knowledge workspace</p>
        <h1 id="login-title">Welcome back.</h1>
        <p className="login-description">Access secured organizational knowledge using Retrieval-Augmented Generation powered by Google Gemini.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" disabled={isLoading} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" disabled={isLoading} />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="sign-in-button" type="submit" disabled={isLoading}>
            {isLoading ? <><span className="spinner" /> Signing in</> : <>Sign In <Icon name="arrow" size={17} /></>}
          </button>
        </form>
        <p className="login-note">This demonstration application is protected for interview evaluation.</p>
      </section>
    </main>
  )
}
