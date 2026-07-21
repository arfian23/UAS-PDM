from google import genai
from google.genai import types

from config import GOOGLE_API_KEY

client = genai.Client(api_key=GOOGLE_API_KEY)

response = client.models.embed_content(
    model="gemini-embedding-001",
    contents="Tidak boleh terdapat dua kegiatan pada waktu yang sama.",
    config=types.EmbedContentConfig(
        output_dimensionality=768
    )
)

embedding = response.embeddings[0].values

print("Dimensi :", len(embedding))
print(embedding[:10])