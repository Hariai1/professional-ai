import weaviate
from weaviate.auth import AuthApiKey
from weaviate.classes.query import Filter
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
RAG_API_KEY = os.getenv("RAG_API_KEY")
RAG_CLUSTER_URL = os.getenv("RAG_CLUSTER_URL")

# ✅ Connect to RAG cluster
client_weaviate = weaviate.connect_to_weaviate_cloud(
    cluster_url=RAG_CLUSTER_URL,
    auth_credentials=AuthApiKey(RAG_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

# ✅ Select your collection
ca_collection = client_weaviate.collections.get("Ca_rag_content")

# ✅ Delete all entries with chapter = "Ind AS 2"
deleted = ca_collection.data.delete_many(
    where=Filter.by_property("chapter").equal("Ind AS 2")
)

print(f"🗑️ Deleted all entries for chapter 'Ind AS 2': {deleted.matches} objects.")

# ✅ Close connection
client_weaviate.close()
