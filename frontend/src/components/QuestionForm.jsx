import { useState } from 'react'
import { Icon } from './Icon'

export function QuestionForm({ onAsk, isLoading }) {
  const [question, setQuestion] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion) {
      setValidationMessage('Enter a policy question to continue.')
      return
    }
    setValidationMessage('')
    onAsk(trimmedQuestion)
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="policy-question">Ask PolicyPilot</label>
      <div className="input-shell">
        <Icon name="search" size={20} />
        <input
          id="policy-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about company policy..."
          disabled={isLoading}
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? <><span className="spinner" /> Finding answer</> : <>Ask <Icon name="arrow" size={17} /></>}
        </button>
      </div>
      {validationMessage && <p className="validation-message" role="alert">{validationMessage}</p>}
      <p className="input-hint">Answers are generated from retrieved employee handbook content.</p>
    </form>
  )
}
