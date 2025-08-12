import os
import weaviate
from weaviate.auth import AuthApiKey
from dotenv import load_dotenv

load_dotenv()

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=os.getenv("RAG_CLUSTER_URL"),
    auth_credentials=AuthApiKey(os.getenv("RAG_API_KEY")),
    headers={"X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")}
)

print("✅ Connected to Weaviate Cloud")

# ✅ Proper method in v4 client to get class names
class_names = list(client.collections.list_all().keys())
print("📚 Classes in schema:")
for name in class_names:
    print("-", name)

client.close()
