import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import weaviate
from weaviate.auth import AuthApiKey
from weaviate.collections.classes.config import Property, DataType, CollectionConfig


if "Cma_rag_content" not in client.collections.list_all().keys():
    print("📘 Creating Cma_rag_content class...")
    config = CollectionConfig(
        name="Cma_rag_content",
        properties=[
            Property(name="text", data_type=DataType.TEXT),
            Property(name="level", data_type=DataType.TEXT),
            Property(name="subject", data_type=DataType.TEXT),
            Property(name="source", data_type=DataType.TEXT)
        ],
        vectorizer_config=CollectionConfig.Vectorizer.text2vec_openai()
    )
    client.collections.create(config)
    print("✅ Cma_rag_content class created.")




# ✅ Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CMA_API_KEY = os.getenv("CMA_API_KEY")
CMA_CLUSTER_URL = os.getenv("CMA_CLUSTER_URL")

# ✅ Connect to Weaviate
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=CMA_CLUSTER_URL,
    auth_credentials=AuthApiKey(CMA_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

# ✅ Chunk text
def chunk_text(text, chunk_size=500, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)

# ✅ Extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    return "".join([page.get_text() for page in doc])

# ✅ Upload chunks to Weaviate
def upload_chunks(chunks, level, subject, source="ICMAI Study Material"):
    collection = client.collections.get("Cma_rag_content")
    embedder = OpenAIEmbeddings(model="text-embedding-3-small")
    for i, chunk in enumerate(chunks):
        try:
            vector = embedder.embed_query(chunk)
            collection.data.insert(
                properties={
                    "text": chunk,
                    "level": level,
                    "subject": subject,
                    "source": source
                },
                vector=vector
            )
            print(f"✅ Uploaded chunk {i+1}/{len(chunks)} for {subject}")
        except Exception as e:
            print(f"❌ Error uploading chunk {i+1}: {e}")

# ✅ Process all CMA PDFs
def process_all_pdfs(folder_path):
    print("📦 Starting CMA upload...")
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf") and file_name.startswith("CMA_"):
            try:
                parts = file_name.replace(".pdf", "").split("_", 2)
                if len(parts) < 3:
                    print(f"⚠️ Skipped improperly named file: {file_name}")
                    continue
                level = parts[1]
                subject = parts[2].replace("_", " ")

                pdf_path = os.path.join(folder_path, file_name)
                print(f"📄 Processing: {file_name} → Level: {level}, Subject: {subject}")

                text = extract_text_from_pdf(pdf_path)
                chunks = chunk_text(text)
                upload_chunks(chunks, level, subject)
            except Exception as e:
                print(f"❌ Failed to process {file_name}: {e}")
    print("🎉 All CMA PDFs processed.")

# ✅ Main
if __name__ == "__main__":
    folder_path = "/Users/harikumarreddyganta/Desktop/professional-ai/CMA"  # Update as needed
    process_all_pdfs(folder_path)
    client.close()
