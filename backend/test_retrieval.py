from app.services.gemini_service import embed_text
from app.services.document_repository import search_similar_chunks

question = "How long is the introductory period?"

embedding = embed_text(question)

results = search_similar_chunks(embedding)

for result in results:
    print("=" * 60)
    print(result["similarity"])
    print(result["content"])