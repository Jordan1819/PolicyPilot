# API Routes

import hashlib
import hmac
import secrets
import time
from pathlib import Path

from fastapi import Cookie, Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.config import (
    COOKIE_SECURE,
    COOKIE_SAMESITE,
    CORS_ORIGINS,
    MASTER_PASSWORD,
    MASTER_USERNAME,
    SESSION_DURATION_SECONDS,
    SESSION_SECRET,
)
from app.models import QuestionRequest, AnswerResponse, LoginRequest
from app.services.retrieval_service import answer_question

app = FastAPI()

# The frontend runs on a separate local development origin.  This keeps the
# existing API contract unchanged while allowing the browser client to call it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The handbook is served through an authenticated route so the source document
# is available only to signed-in demo users.
HANDBOOK_PATH = Path(__file__).resolve().parent.parent / "documents" / "handbook.pdf"
SESSION_COOKIE_NAME = "policypilot_session"


def _session_signature(expires_at: int) -> str:
    if not SESSION_SECRET:
        raise RuntimeError("SESSION_SECRET must be configured before starting PolicyPilot.")
    message = f"policypilot:{expires_at}".encode()
    return hmac.new(SESSION_SECRET.encode(), message, hashlib.sha256).hexdigest()


def _create_session() -> str:
    expires_at = int(time.time()) + SESSION_DURATION_SECONDS
    return f"{expires_at}.{_session_signature(expires_at)}"


def require_authenticated_user(session: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME)):
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication is required.")

    try:
        expiry_text, signature = session.split(".", 1)
        expires_at = int(expiry_text)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Your session is invalid. Please sign in again.")

    expected_signature = _session_signature(expires_at)
    if expires_at < time.time() or not secrets.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Your session has expired. Please sign in again.")


@app.post("/auth/login")
def login(request: LoginRequest, response: Response):
    if not MASTER_USERNAME or not MASTER_PASSWORD:
        raise RuntimeError("MASTER_USERNAME and MASTER_PASSWORD must be configured before starting PolicyPilot.")

    credentials_are_valid = (
        secrets.compare_digest(request.username, MASTER_USERNAME)
        and secrets.compare_digest(request.password, MASTER_PASSWORD)
    )
    if not credentials_are_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The username or password is incorrect.")

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=_create_session(),
        max_age=SESSION_DURATION_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
    )
    return {"authenticated": True}


@app.get("/auth/session")
def get_session(_: None = Depends(require_authenticated_user)):
    return {"authenticated": True}


@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
    )
    return {"authenticated": False}

@app.get("/")
def root():
    return {"message": "PolicyPilot API is running!"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask", response_model=AnswerResponse)
def ask(request: QuestionRequest, _: None = Depends(require_authenticated_user)):
    return answer_question(request.question)


@app.get("/documents/handbook.pdf")
def employee_handbook(_: None = Depends(require_authenticated_user)):
    return FileResponse(HANDBOOK_PATH, media_type="application/pdf")
