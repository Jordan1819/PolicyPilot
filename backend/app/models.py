from pydantic import BaseModel

class QuestionRequest(BaseModel):
    question: str

class LoginRequest(BaseModel):
    username: str
    password: str

class Source(BaseModel):
    document: str
    chunk_index: int
    similarity: float

class AnswerResponse(BaseModel):
    answer: str
    sources: list[Source]
