# PolicyPilot

## [Check it out here!](https://policypilot-m2td.onrender.com/)

> AI-Powered Enterprise Knowledge Assistant

PolicyPilot is a retrieval-augmented generation (RAG) application that helps employees find grounded answers to questions about an employee handbook. Rather than relying on a model's general knowledge, it retrieves relevant passages from the organization’s indexed policy content and supplies that context to Google Gemini before an answer is generated.

The project was built as an AI Integration Engineer portfolio piece. It demonstrates the practical integration work behind an enterprise knowledge assistant: document ingestion, semantic retrieval, vector search, grounded generation, source visibility, and lightweight demo access control.

## Highlights

- Ask natural-language questions about employee policy.
- Retrieve semantically relevant handbook excerpts using vector similarity search.
- Generate concise, grounded responses with Google Gemini.
- Show the document excerpts used to support each response, including similarity scores.
- Open the source employee handbook from the authenticated workspace.
- Protect the demonstration with one environment-configured shared account and a signed HTTP-only session cookie.

## Architecture

```text
Employee
   │
   ▼
React + Vite frontend
   │  authenticated requests
   ▼
FastAPI API ──► Session validation
   │
   ├──► Gemini embedding model ──► Supabase PostgreSQL + pgvector
   │                                      │
   │                                      ▼
   │                              Relevant handbook chunks
   │
   └──► Gemini generation model ◄──────── Retrieved context
                         │
                         ▼
              Grounded answer + source metadata
```

## How the RAG workflow works

1. **Ingest the handbook** — The ingestion process reads the employee handbook PDF, extracts its content, splits it into manageable chunks, and records identifying metadata such as the document name and chunk index.
2. **Create embeddings** — Each chunk is converted into a vector representation with Gemini’s embedding capability.
3. **Store vectors** — Content, metadata, and vectors are persisted in Supabase PostgreSQL with the `pgvector` extension.
4. **Receive a question** — The React client sends an authenticated `POST /ask` request to FastAPI.
5. **Retrieve evidence** — The API embeds the question and performs semantic similarity search against the stored document chunks.
6. **Generate a grounded response** — The most relevant passages are included as context in a Gemini prompt that instructs the model to use only the supplied handbook evidence.
7. **Show transparency** — The UI displays the generated answer alongside the retrieved source document, excerpt index, and similarity score.

This approach makes PolicyPilot more useful than keyword search alone while helping users understand where each answer came from.

## Tech stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | React, Vite, modern CSS | Responsive enterprise-style user experience |
| API | FastAPI, Pydantic | Lightweight API and request validation |
| Generation | Google Gemini | Grounded answer generation |
| Embeddings | Google Gemini embedding API | Semantic representations for questions and content |
| Vector store | Supabase PostgreSQL + pgvector | Persistent semantic search over handbook chunks |
| Document processing | PyPDF / LangChain text utilities | PDF extraction and chunking support |
| Access control | Signed HTTP-only cookie session | Lightweight shared-demo access protection |

## Access control

PolicyPilot intentionally uses a small, single-account access layer suitable for an interview demonstration—not a full identity system.

- The shared username and password are stored only in backend environment variables.
- `POST /auth/login` validates those values and issues a signed, time-limited HTTP-only cookie.
- The cookie contains no password and is validated on every protected request.
- The RAG endpoint (`/ask`) and handbook PDF endpoint require a valid session.
- `POST /auth/logout` clears the session cookie.

There is no registration, database-backed user management, OAuth, JWT, roles, or password-reset flow. A production deployment would use the organization’s identity provider and a more complete authorization model.

## Project structure

```text
PolicyPilot/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI routes, session checks, CORS
│   │   ├── config.py               # Environment configuration
│   │   ├── models.py               # Request and response models
│   │   ├── database/
│   │   └── services/               # Retrieval, Gemini, ingestion, PDF logic
│   ├── documents/handbook.pdf      # Source document used by the RAG system
│   ├── ingest_handbook.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/                    # API client and session-aware requests
    │   ├── components/             # Login, form, source, and sidebar UI
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Local setup

### Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer
- A Google Gemini API key
- A Supabase project configured with the required `pgvector` search function and indexed handbook content

### 1. Configure the backend

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Update `backend/.env` with your secrets:

```env
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

MASTER_USERNAME=demo
MASTER_PASSWORD=replace-with-a-strong-password
SESSION_SECRET=replace-with-a-long-random-secret
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

`SESSION_SECRET` should be a long, unique random value. Do not commit `.env` files.

### 2. Start the API

Run this from the `backend` directory so the application loads `backend/.env`:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### 3. Configure and start the frontend

In a second terminal:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install
pnpm dev
```

The default frontend configuration points to `http://localhost:8000`. To use a different API location, change `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Open the Vite URL shown in the terminal, typically `http://localhost:5173`, and sign in with the configured master account.

### Dependency manifests

The backend uses [backend/requirements.txt](backend/requirements.txt), which lists the direct Python runtime dependencies with pinned versions. Install it with `pip install -r requirements.txt`.

The frontend uses the standard Node.js dependency files: [frontend/package.json](frontend/package.json) declares direct React and Vite dependencies, while [frontend/pnpm-lock.yaml](frontend/pnpm-lock.yaml) locks the complete dependency tree for reproducible installs. Install it with `pnpm install --frozen-lockfile`.

## API overview

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Basic API health message |
| `POST` | `/auth/login` | No | Validates the shared credentials and creates a session |
| `GET` | `/auth/session` | Yes | Confirms whether the current browser session is valid |
| `POST` | `/auth/logout` | No | Clears the current browser session |
| `POST` | `/ask` | Yes | Retrieves relevant chunks and returns a grounded answer |
| `GET` | `/documents/handbook.pdf` | Yes | Opens the source handbook PDF |

### Ask request and response

```json
POST /ask
{
  "question": "How much paid time off do employees receive?"
}
```

```json
{
  "answer": "...",
  "sources": [
    {
      "document": "handbook.pdf",
      "chunk_index": 4,
      "similarity": 0.91
    }
  ]
}
```

## Deployment notes

- PolicyPilot is deployed on Render as two separate services: a **Python Web Service** for the FastAPI API and a **Static Site** for the compiled React/Vite frontend. Supabase remains the managed vector database.
- The frontend Static Site is built from `frontend/` and receives the public backend URL through `VITE_API_BASE_URL`. The backend Web Service runs from `backend/` with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Set `VITE_API_BASE_URL` to the complete public URL of the deployed backend, then set the backend’s `CORS_ORIGINS` to the exact public URL of the deployed frontend.
- Set `COOKIE_SECURE=true` when the application is served over HTTPS.
- When the frontend and API are on different sites, set `COOKIE_SAMESITE=none` with `COOKIE_SECURE=true` so the browser includes the session cookie with cross-site API requests. The default `lax` setting remains appropriate for local development and same-site sibling custom domains such as `app.example.com` and `api.example.com`.
- Set `CORS_ORIGINS` to the exact deployed frontend origin or origins, separated by commas.
- Keep Gemini, Supabase, authentication, and session values in the hosting platform’s secret manager—not source control.
- Ingest the employee handbook before demonstrating the application so the vector store contains searchable content.

## Scope

PolicyPilot is intentionally focused on the knowledge-assistant workflow. It does not include user registration, conversation history, document uploads through the UI, administrative tools, analytics, or a production identity system. Those concerns are intentionally outside the MVP so the project can emphasize RAG implementation and clear enterprise-oriented interaction design.
