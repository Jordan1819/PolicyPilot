import { Icon } from './Icon'

export function AnswerCard({ response }) {
  if (!response) return null

  return (
    <section className="answer-card" aria-live="polite">
      <div className="answer-heading">
        <div className="answer-icon"><Icon name="spark" size={20} /></div>
        <div>
          <p className="eyebrow">Grounded response</p>
          <h2>Answer</h2>
        </div>
      </div>
      <p className="answer-text">{response.answer}</p>

      {response.sources?.length > 0 && (
        <div className="sources-section">
          <div className="sources-title"><Icon name="source" size={17} /> <h3>Retrieved sources</h3></div>
          <div className="source-list">
            {response.sources.map((source, index) => (
              <article className="source-item" key={`${source.document}-${source.chunk_index}-${index}`}>
                <div>
                  <p>{source.document}</p>
                  <span>Handbook excerpt {source.chunk_index + 1}</span>
                </div>
                {typeof source.similarity === 'number' && <span className="score">{Math.round(source.similarity * 100)}% match</span>}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
