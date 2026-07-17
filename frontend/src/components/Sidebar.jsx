import { handbookUrl } from '../api/policyApi'
import { Icon } from './Icon'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-kicker">Knowledge workspace</p>
        <h2>About PolicyPilot</h2>
        <p className="sidebar-copy">An enterprise retrieval-augmented generation assistant designed to turn policy questions into grounded, useful answers.</p>
      </div>

      <div className="technology-list" aria-label="Technology used">
        <span>Google Gemini</span>
        <span>Semantic Search</span>
        <span>Vector Embeddings</span>
        <span>Supabase pgvector</span>
      </div>

      <a className="handbook-link" href={handbookUrl} target="_blank" rel="noreferrer">
        <Icon name="document" size={18} />
        <span>View Employee Handbook</span>
        <Icon name="arrow" size={16} />
      </a>
    </aside>
  )
}
