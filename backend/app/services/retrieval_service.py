from app.services.gemini_service import (
    embed_text,
    ask_gemini,
)

from app.services.document_repository import (
    search_similar_chunks,
)

from app.models import (
    AnswerResponse, Source
)


def answer_question(question: str):

    question_embedding = embed_text(question)

    chunks = search_similar_chunks(question_embedding)

    context = "\n\n".join(
        chunk["content"]
        for chunk in chunks
    )

    prompt = f"""
You are an enterprise policy and knowledge assistant for a federal agency.

Answer the user's question using ONLY the provided context.

If the answer cannot be found, say you don't know and advise 

the employee to consult employee resources or to ask a supervisor.

When providing an answer, reference the handbook section name and number that supports your answer.

Provide the answer in a concise, clear, and professional manner.

Context:

{context}

Question:

{question}
"""

    answer = ask_gemini(prompt)

    sources = [
        Source(
            document = chunk["document_name"],
            chunk_index = chunk["chunk_index"],
            similarity = round(chunk["similarity"], 3)
        )
        for chunk in chunks
    ]

    return AnswerResponse(
        answer = answer,
        sources = sources
    )
