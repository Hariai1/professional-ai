import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import weaviate
from weaviate.auth import AuthApiKey
from weaviate.collections.classes.config import Property, DataType, CollectionConfig

def create_collection_if_not_exists():
    if "Ca_rag_content" not in client.collections.list_all().keys():
        print("📘 Creating Ca_rag_content class...")
        config = CollectionConfig(
            name="Ca_rag_content",
            properties=[
                Property(name="text", data_type=DataType.TEXT),
                Property(name="level", data_type=DataType.TEXT),
                Property(name="subject", data_type=DataType.TEXT),
                Property(name="chapter", data_type=DataType.TEXT),
                Property(name="source", data_type=DataType.TEXT),
            ],
            vectorizer_config=CollectionConfig.Vectorizer.text2vec_openai()
        )
        client.collections.create(config)
        print("✅ Created collection: Ca_rag_content")
    else:
        print("✅ Collection Ca_rag_content already exists")


# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
RAG_API_KEY = os.getenv("RAG_API_KEY")
RAG_CLUSTER_URL = os.getenv("RAG_CLUSTER_URL")

# Connect to Weaviate
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=RAG_CLUSTER_URL,
    auth_credentials=AuthApiKey(RAG_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)


# ✅ Step 2: Extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    return "".join([page.get_text() for page in doc])

# ✅ Step 3: Chunk text
def chunk_text(text, chunk_size=500, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)

# ✅ Step 4: Upload chunks
def upload_chunks(chunks, level, subject, chapter, source="ICAI Study Material"):
    collection = client.collections.get("Ca_rag_content")
    embedder = OpenAIEmbeddings(model="text-embedding-3-small")
    for i, chunk in enumerate(chunks):
        try:
            vector = embedder.embed_query(chunk)
            collection.data.insert(
                properties={
                    "text": chunk,
                    "level": level,
                    "subject": subject,
                    "chapter": chapter,
                    "source": source
                },
                vector=vector
            )
            print(f"✅ Uploaded chunk {i+1}/{len(chunks)} for {chapter}")
        except Exception as e:
            print(f"❌ Error uploading chunk {i+1}: {e}")

# ✅ Step 5: Loop through all PDFs
def process_all_pdfs(folder_path):
    print("📦 Skipping collection creation — using existing Ca_rag_content")

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf") and file_name.startswith("CA_"):
            try:
                parts = file_name.replace(".pdf", "").split("_", 3)
                if len(parts) < 4:
                    print(f"⚠️ Skipped improperly named file: {file_name}")
                    continue
                level, subject, chapter = parts[1], parts[2], parts[3]

                pdf_path = os.path.join(folder_path, file_name)
                print(f"📄 Processing: {file_name}")

                text = extract_text_from_pdf(pdf_path)
                chunks = chunk_text(text)
                upload_chunks(chunks, level, subject, chapter)
            except Exception as e:
                print(f"❌ Failed to process {file_name}: {e}")

    print("🎉 All PDFs processed.")

# ✅ Main runner
if __name__ == "__main__":
    folder_path = "/Users/harikumarreddyganta/Desktop/professional-ai/CA"  # Change if needed
    create_collection_if_not_exists()  # ✅ Add this
    process_all_pdfs(folder_path)
    client.close()
