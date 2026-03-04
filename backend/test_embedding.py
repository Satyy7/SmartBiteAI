from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.embed_content(
    model="gemini-embedding-001",
    contents="Paneer butter masala rich creamy North Indian curry",
    config={
        "output_dimensionality": 768
    }
)

embedding = response.embeddings[0].values

print("Embedding length:", len(embedding))