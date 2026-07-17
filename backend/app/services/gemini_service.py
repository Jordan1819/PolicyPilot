# AI Logic

from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def ask_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model = "gemini-flash-lite-latest",
        contents=prompt,
    )

    return response.text

def embed_text(text: str) -> list[float]:
    response = client.models.embed_content(
        model = "gemini-embedding-001",
        contents=text,
    )

    return response.embeddings[0].values
