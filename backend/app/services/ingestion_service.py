from pathlib import Path

from app.services.pdf_service import extract_text
from app.services.chunking_service import chunk_text
from app.services.gemini_service import embed_text
from backend.app.services.document_repository import insert_chunk

def ingest_document(file_path: str):
    
    document_name = Path(file_path).name
    text = extract_text(file_path)
    chunks = chunk_text(text)
    print(f"Creating {len(chunks)} chunks...")

    for index, chunk in enumerate(chunks):
        embedding = embed_text(chunk)

        insert_chunk(
            document_name=document_name,
            chunk_index=index,
            content=chunk,
            embedding=embedding
        )
    print("Ingestion complete.")