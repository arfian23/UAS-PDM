from google import genai
from google.genai import types

from config import GOOGLE_API_KEY
from database.supabase import supabase
from rag.loader import load_documents


# ==========================================
# Gemini Client
# ==========================================

client = genai.Client(api_key=GOOGLE_API_KEY)


# ==========================================
# Generate Embedding
# ==========================================

def generate_embedding(text: str):

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=768
        )
    )

    return response.embeddings[0].values


# ==========================================
# Save to Supabase
# ==========================================

def save_embedding(filename, content, embedding):

    data = {
        "filename": filename,
        "content": content,
        "embedding": embedding
    }

    supabase.table("knowledge_embeddings").insert(data).execute()


# ==========================================
# Main
# ==========================================

def main():

    print("=" * 50)
    print("SMART SCHEDULER AI")
    print("Knowledge Embedding")
    print("=" * 50)

    documents = load_documents()

    total = len(documents)

    print(f"\nTotal Chunk : {total}\n")

    for index, doc in enumerate(documents, start=1):

        filename = doc["filename"]
        content = doc["content"]

        print(f"[{index}/{total}] Embedding {filename}")

        embedding = generate_embedding(content)

        save_embedding(
            filename,
            content,
            embedding
        )

        print("✓ Berhasil disimpan\n")

    print("=" * 50)
    print("SELESAI")
    print("=" * 50)


if __name__ == "__main__":
    main()