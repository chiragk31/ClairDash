from sentence_transformers import SentenceTransformer
from app.core.database import supabase
import numpy as np

# Load model once at startup — not on every request
# This model is lightweight, fast, and good for semantic similarity
model = SentenceTransformer("all-MiniLM-L6-v2")

# Similarity threshold — complaints above this score are considered duplicates/related
SIMILARITY_THRESHOLD = 0.85


def generate_embedding(text: str) -> list[float]:
    """
    Converts text into a vector embedding.
    Returns a list of 384 floats representing the semantic meaning of the text.
    """
    if not text:
        return []

    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()


def store_embedding(complaint_id: str, embedding: list[float]) -> bool:
    """
    Stores the vector embedding in Supabase complaint_embeddings table.
    Returns True if successful, False if failed.
    """
    try:
        supabase.table("complaint_embeddings").insert({
            "complaint_id": complaint_id,
            "embedding": embedding
        }).execute()
        return True

    except Exception as e:
        print(f"[EmbeddingService] Failed to store embedding: {e}")
        return False


def find_similar_complaints(
    embedding: list[float],
    current_complaint_id: str,
    limit: int = 5
) -> list[dict]:
    """
    Searches Supabase for complaints with similar embeddings using pgvector.
    Returns list of similar complaints with their similarity scores.

    Requires pgvector extension enabled in Supabase and
    match_complaints RPC function created in Supabase (see setup note below).
    """
    try:
        response = supabase.rpc(
            "match_complaints",
            {
                "query_embedding": embedding,
                "match_threshold": SIMILARITY_THRESHOLD,
                "match_count": limit,
                "exclude_id": current_complaint_id
            }
        ).execute()

        if response.data:
            return response.data
        return []

    except Exception as e:
        print(f"[EmbeddingService] Similarity search failed: {e}")
        return []


def store_duplicate_links(
    complaint_id: str,
    similar_complaints: list[dict]
) -> bool:
    """
    Saves relationships between similar/duplicate complaints
    in the duplicate_links table.
    """
    if not similar_complaints:
        return True

    try:
        links = [
            {
                "complaint_id": complaint_id,
                "related_complaint_id": match["complaint_id"],
                "similarity_score": round(match["similarity"], 4)
            }
            for match in similar_complaints
        ]

        supabase.table("duplicate_links").insert(links).execute()
        return True

    except Exception as e:
        print(f"[EmbeddingService] Failed to store duplicate links: {e}")
        return False


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """
    Manual cosine similarity calculation.
    Used for local testing without needing pgvector.
    """
    a = np.array(vec1)
    b = np.array(vec2)

    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0

    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))