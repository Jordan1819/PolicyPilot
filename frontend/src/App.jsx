import { useEffect, useState } from 'react'
import { askPolicyQuestion, getSession, signIn, signOut } from './api/policyApi'
import { AnswerCard } from './components/AnswerCard'
import { Icon } from './components/Icon'
import { QuestionForm } from './components/QuestionForm'
import { Sidebar } from './components/Sidebar'
import { LoginPage } from './components/LoginPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    getSession()
      .then(setIsAuthenticated)
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsCheckingSession(false))
  }, [])

  async function handleSignIn(username, password) {
    await signIn(username, password)
    setIsAuthenticated(true)
  }

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await signOut()
      setResponse(null)
      setError('')
      setIsAuthenticated(false)
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Unable to sign out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  async function handleAsk(question) {
    setIsLoading(true)
    setError('')
    setResponse(null)
    try {
      setResponse(await askPolicyQuestion(question))
    } catch (requestError) {
      if (requestError?.code === 'SESSION_EXPIRED') {
        setIsAuthenticated(false)
        return
      }
      setError(requestError instanceof Error ? requestError.message : 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return <main className="session-check"><span className="spinner session-spinner" /> Confirming secure access</main>
  }

  if (!isAuthenticated) return <LoginPage onSignIn={handleSignIn} />

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="PolicyPilot home">
          <span className="brand-mark"><Icon name="spark" size={22} /></span>
          <span>PolicyPilot</span>
        </a>
        <p>AI-Powered Enterprise Knowledge Assistant</p>
        <span className="status"><span className="status-dot" /> Knowledge base ready</span>
        <button className="logout-button" type="button" onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? 'Signing out…' : 'Log out'}
        </button>
      </header>

      <section className="question-area">
        <QuestionForm onAsk={handleAsk} isLoading={isLoading} />
      </section>

      <div className="workspace">
        <Sidebar />
        <main>
          <section className="hero">
            <p className="eyebrow">Employee handbook assistant</p>
            <h1>Find the policy guidance you need.</h1>
            <p>Ask a question in plain language. PolicyPilot retrieves relevant handbook context before generating a response.</p>
          </section>

          {error && <div className="error-card" role="alert"><strong>Unable to complete your request</strong><span>{error}</span></div>}
          <AnswerCard response={response} />
        </main>
      </div>

      <footer>Built as an AI Integration Engineer portfolio project.</footer>
    </div>
  )
}
