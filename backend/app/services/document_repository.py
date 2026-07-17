from app.database.supabase import supabase

def insert_chunk(
        document_name: str,
        chunk_index: int,
        content: str,
        embedding: list[float]
):
    response = (
        supabase.table("document_chunks")
        .insert({
            "document_name": document_name,
            "chunk_index": chunk_index,
            "content": content,
            "embedding": embedding,
        })
        .execute()
    )

    return response


def search_similar_chunks(
        embedding: list[float],
        limit: int = 3
):
    response = (
        supabase.rpc(
            "match_document_chunks",
            {
                "query_embedding": embedding,
                "match_count": limit
            }
        )
        .execute()
    )

    return response.data