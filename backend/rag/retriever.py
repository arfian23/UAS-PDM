from google import genai
from google.genai import types

from config import GOOGLE_API_KEY
from database.supabase import supabase

client = genai.Client(api_key=GOOGLE_API_KEY)


def retrieve(query, top_k=3):
    """
    Mengambil knowledge paling relevan dari Vector Database.
    """

    print("=" * 50)
    print("SMART SCHEDULER AI")
    print("Retriever")
    print("=" * 50)

    print(f"Query : {query}")

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=query,
        config=types.EmbedContentConfig(
            output_dimensionality=768
        )
    )

    query_embedding = response.embeddings[0].values

    result = (
        supabase.rpc(
            "match_knowledge",
            {
                "query_embedding": query_embedding,
                "match_count": top_k,
            },
        )
        .execute()
    )

    print("\nKnowledge Ditemukan\n")

    for i, row in enumerate(result.data, start=1):
        print(f"[{i}] {row['filename']}")
        print(f"Similarity : {row['similarity']:.4f}")
        print(row["content"])
        print("-" * 50)

    return result.data


if __name__ == "__main__":

    retrieve(
        "Saya ingin menjadwalkan UTS minggu depan"
    )