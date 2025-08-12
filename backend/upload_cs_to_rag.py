import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import weaviate
from weaviate.auth import AuthApiKey
from weaviate.collections.classes.config import Property, DataType, CollectionConfig

if "Cs_rag_content" not in client.collections.list_all().keys():
    print("📘 Creating Cs_rag_content class...")
    config = CollectionConfig(
        name="Cs_rag_content",
        properties=[
            Property(name="text", data_type=DataType.TEXT),
            Property(name="level", data_type=DataType.TEXT),
            Property(name="subject", data_type=DataType.TEXT),
            Property(name="source", data_type=DataType.TEXT)
        ],
        vectorizer_config=CollectionConfig.Vectorizer.text2vec_openai()
    )
    client.collections.create(config)
    print("✅ Cs_rag_content class created.")



# ✅ Load .env variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CS_API_KEY = os.getenv("CS_API_KEY")
CS_CLUSTER_URL = os.getenv("CS_CLUSTER_URL")

# ✅ Connect to Weaviate
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=CS_CLUSTER_URL,
    auth_credentials=AuthApiKey(CS_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

# ✅ Text chunking
def chunk_text(text, chunk_size=500, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)

# ✅ PDF Text Extractor
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    return "".join([page.get_text() for page in doc])

# ✅ Upload to Weaviate

def process_all_pdfs(folder_path):
    print("📦 Starting CS upload...")
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf") and file_name.startswith("CS_"):
            try:
                parts = file_name.replace(".pdf", "").split("_", 2)
                if len(parts) < 3:
                    print(f"⚠️ Skipped improperly named file: {file_name}")
                    continue
                level = parts[1]
                subject = parts[2].replace("_", " ")

                # ✅ Only run for the failed subject
                if subject != "Goods & Services Tax (GST) & Corporate Tax Planning":
                    continue

                # ✅ Only run for the failed subject
                if subject != "Goods & Services Tax (GST) & Corporate Tax Planning":
                    continue

                pdf_path = os.path.join(folder_path, file_name)
                print(f"📄 Processing: {file_name} → Level: {level}, Subject: {subject}")

                text = extract_text_from_pdf(pdf_path)
                chunks = chunk_text(text)
                upload_chunks(chunks, level, subject)
            except Exception as e:
                print(f"❌ Failed to process {file_name}: {e}")
    print("🎉 All CS PDFs processed.")
    

#def upload_chunks(chunks, level, subject, source="ICSI Study Material"):
#    collection = client.collections.get("Cs_rag_content")
#    embedder = OpenAIEmbeddings(model="text-embedding-3-small")
#
#    start_chunk = 1511
#    end_chunk = 2116
#
#    for i, chunk in enumerate(chunks):
#        if i < start_chunk or i > end_chunk:
#            continue  # Skip all other chunks
#
#        try:
#            vector = embedder.embed_query(chunk)
#            collection.data.insert(
#                properties={
#                    "text": chunk,
#                    "level": level,
#                    "subject": subject,
#                    "source": source
#                },
#                vector=vector
#            )
#            print(f"✅ Uploaded chunk {i+1}/{len(chunks)} for {subject}")
#        except Exception as e:
#            print(f"❌ Error uploading chunk {i+1}: {e}")

def upload_chunks(chunks, level, subject, source="ICSI Study Material"):
    collection = client.collections.get("Cs_rag_content")
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

# ✅ Process all CS PDFs
def process_all_pdfs(folder_path):
    print("📦 Starting CS upload...")
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf") and file_name.startswith("CS_"):
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
    print("🎉 All CS PDFs processed.")

# ✅ Main
if __name__ == "__main__":
    folder_path = "/Users/harikumarreddyganta/Desktop/professional-ai/CS"  # Update as needed
    process_all_pdfs(folder_path)
    client.close()
