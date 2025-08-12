from typing import List
from bs4 import BeautifulSoup
import requests
from fastapi import Body
import httpx  # ✅ Make sure httpx is installed: `pip install httpx`
import json
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, File
from fastapi import Request
from bson import ObjectId  # Add to top if not already
from pydantic import BaseModel
from fastapi import HTTPException  # Add to the top if not already
from datetime import datetime, timedelta, UTC  # Add to the top if not already
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
import certifi
import motor.motor_asyncio
from fastapi import FastAPI
from dotenv import load_dotenv
import os
import weaviate
from weaviate.auth import AuthApiKey
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings  # ✅ Add at top if missing

load_dotenv()

# Load Cloudinary credentials
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

MONGODB_URI = os.getenv("MONGODB_URI")  # ✅ Loaded from .env
ca = certifi.where()
client_mongo = motor.motor_asyncio.AsyncIOMotorClient(
    MONGODB_URI, 
    tls=True,
    tlsCAFile=ca
)
db = client_mongo["student_ai_tool"]
approach_collection = db["approaches"]
search_history_collection = db["search_history"]


users_collection = db["users"]  # NEW collection for storing users

from passlib.context import CryptContext  # Add at the top if not already
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


from pydantic import BaseModel
import csv
import spacy
from textblob import TextBlob
from rapidfuzz import process as rapidfuzz_process

REWRITE_SYSTEM_PROMPT = """
You are assisting CA Final students in navigating a structured academic question bank to retrieve the most relevant questions from specific categories.

Objective:
Help students reach the correct type of question efficiently by clarifying their input - without changing their intended meaning.

🧠 Task (2 Steps):
1. Correct any spelling or grammar errors in the student’s query.
2. If necessary, rewrite the corrected query in a professional, academic tone using CA Final terminology.

STRICT RULE:
Do NOT change the original question type, purpose, or intent. Your job is to improve clarity - not reframe or reinterpret.

📘 Matching Guide (based on sourceDetails):
- "example" or "examples" -> Conceptual questions
- "illustration" or "illustrations" -> Numerical questions
- "test your knowledge" or "tyk" -> End-of-chapter test questions
- "mtp" or "model question paper" -> Model Test Papers
- "rtp" or "revision test paper" -> Revision Test Papers
- "past paper" or "question paper" -> Past exam questions
"""

# ✅ Load vocab map from JSON
with open("vocab_map.json", "r") as f:
    vocab_data = json.load(f)



command_filters = {
    "%example": ["example"],
    "%illustration": ["illustration"],
    "%testyourknowledge": ["test your knowledge"],
    "%tyk": ["test your knowledge"],
    "%mtp": ["mtp"],
    "%modelquestionpaper": ["mtp"],
    "%rtp": ["rtp"],
    "%revisiontestpaper": ["rtp"],
    "%pastpapers": ["past papers"],
    "%other": ["other"],
    "%all": ["example", "illustration", "test your knowledge", "mtp", "rtp", "past papers", "other"]
}

ENABLE_SPELL_CORRECTION = False  # Set to True if you want spelling correction

def correct_spelling(text): return str(TextBlob(text).correct())

def rewrite_query(text):
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": REWRITE_SYSTEM_PROMPT},
            {"role": "user", "content": f"Rewrite this CA Final query: {text}"}
        ],
        temperature=0.2
    )
    return response.choices[0].message.content.strip()

# ✅ Add this after rewrite_query()
def expand_query_with_vocab(query, vocab_map):
    expanded = query
    for keyword, synonyms in vocab_map.items():
        if keyword in query.lower():
            expanded += " " + " ".join(synonyms)
    return expanded


# ✅ Load .env variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")
WEAVIATE_URL = os.getenv("WEAVIATE_URL")

RAG_API_KEY = os.getenv("RAG_API_KEY")  # ✅ Add this to .env
RAG_CLUSTER_URL = os.getenv("RAG_CLUSTER_URL")

CMA_CLUSTER_URL = os.getenv("CMA_CLUSTER_URL")
CMA_API_KEY = os.getenv("CMA_API_KEY")

CS_CLUSTER_URL = os.getenv("CS_CLUSTER_URL")
CS_API_KEY = os.getenv("CS_API_KEY")

# ✅ Print just to confirm loading
print("🔑 OpenAI Key Start:", OPENAI_API_KEY[:8])
print("🔑 Weaviate URL:", WEAVIATE_URL)

# ✅ Initialize FastAPI app
app = FastAPI()
@app.get("/health")
def health():
    return {"status": "ok"}

# ---- CORS (env-driven, supports dev + prod) ----
from fastapi.middleware.cors import CORSMiddleware
import os

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,https://professional-ai-delta.vercel.app"
)
origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                    # explicit domains (local + prod)
    allow_origin_regex=r"https://.*\.vercel\.app",  # ✅ all Vercel previews
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client_weaviate_qb = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_URL,
    auth_credentials=AuthApiKey(WEAVIATE_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)
# ✅ CA RAG Cluster
client_weaviate_rag = weaviate.connect_to_weaviate_cloud(
    cluster_url=os.getenv("RAG_CLUSTER_URL"),
    auth_credentials=AuthApiKey(os.getenv("RAG_API_KEY")),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)
# ✅ CMA RAG Cluster
client_weaviate_rag_cma = weaviate.connect_to_weaviate_cloud(
    cluster_url=os.getenv("CMA_CLUSTER_URL"),
    auth_credentials=AuthApiKey(os.getenv("CMA_API_KEY")),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

# ✅ CS RAG Cluster
client_weaviate_rag_cs = weaviate.connect_to_weaviate_cloud(
    cluster_url=os.getenv("CS_CLUSTER_URL"),
    auth_credentials=AuthApiKey(os.getenv("CS_API_KEY")),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

print("🔑 Weaviate URL:", RAG_CLUSTER_URL)

print("📚 QB Classes:", list(client_weaviate_qb.collections.list_all().keys()))
print("📚 CA RAG Classes:", list(client_weaviate_rag.collections.list_all().keys()))
print("📚 CMA RAG Classes:", list(client_weaviate_rag_cma.collections.list_all().keys()))
print("📚 CS RAG Classes:", list(client_weaviate_rag_cs.collections.list_all().keys()))


nlp = spacy.load("en_core_web_sm")  # Load the NLP model
collection = client_weaviate_qb.collections.get("FR_Inventories")  # Replace with your actual class name if different


# ✅ Test route
@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

@app.get("/test-connections")
async def test_connections():
    results = {}

    # Mongo
    try:
        await client_mongo.admin.command("ping")
        results["mongo"] = "connected"
    except Exception as e:
        results["mongo"] = f"failed: {e}"

    # Weaviate (QB)
    try:
        results["weaviate_qb_ready"] = client_weaviate_qb.is_ready()
    except Exception as e:
        results["weaviate_qb_ready"] = f"failed: {e}"

    # Weaviate (RAG clusters)
    for name, cli in {
        "weaviate_ca": client_weaviate_rag,
        "weaviate_cma": client_weaviate_rag_cma,
        "weaviate_cs": client_weaviate_rag_cs,
    }.items():
        try:
            results[f"{name}_ready"] = cli.is_ready()
        except Exception as e:
            results[f"{name}_ready"] = f"failed: {e}"

    # OpenAI
    results["openai_key_start"] = (OPENAI_API_KEY or "")[:8]

    return results

def normalize_tokens(text):
    return [token.lemma_.lower() for token in nlp(text) if not token.is_stop and not token.is_punct]

def expand_variants(term):
    term = term.lower().strip().replace(",", "")
    return {term, term.replace("-", " "), term.replace(" ", "-"), term.replace("-", "").replace(" ", "")}

def fuzzy_terms_match(query_terms, all_tags, threshold=80):
    results = []
    for term in query_terms:
        matches = rapidfuzz_process.extract(term, all_tags, limit=3)
        results.extend([m[0] for m in matches if m[1] >= threshold])
    return list(set(results))

def log_query(original, rewritten, method, count):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("query_log.csv", "a", newline="") as f:
        writer = csv.writer(f)
        if f.tell() == 0:
            writer.writerow(["Timestamp", "Original", "Rewritten", "Method", "Count"])
        writer.writerow([timestamp, original, rewritten, method, count])
class QueryInput(BaseModel):
    query: str
    level: str
    subject: str
    chapter: str


@app.post("/process")
def process_query(payload: QueryInput):
    raw_query = payload.query.strip()
    # You can later pass these from frontend or user profile
    Level = payload.level.strip()
    Subject = payload.subject.strip()
    chapter = payload.chapter.strip()

    # 🔁 For now, hardcode Level + chapter (you can automate later)
    vocab_map = vocab_data.get(Level, {}).get(Subject, {}).get(chapter, {})

    results = []

    if raw_query.lower() in command_filters:
        filters = command_filters[raw_query.lower()]
        all_objs = collection.query.fetch_objects(limit=1000).objects
        results = [o.properties for o in all_objs if any(f in o.properties.get("sourceDetails", "").lower() for f in filters)]
        method = "Command Filter"

    elif raw_query.startswith("#"):
        term = correct_spelling(raw_query[1:])
        variants = expand_variants(term)
        all_objs = collection.query.fetch_objects(limit=1000).objects
        for obj in all_objs:
            qtext = obj.properties.get("combinedText", "").lower().replace("-", " ").replace(",", "")
            if any(v in qtext for v in variants):
                results.append(obj.properties)
        method = "Hashtag"

    else:
        spell_checked = correct_spelling(raw_query) if ENABLE_SPELL_CORRECTION else raw_query
        expanded_query = expand_query_with_vocab(spell_checked, vocab_map)
        rewritten = rewrite_query(expanded_query)
        print(f"✅ Spell Checked Query: {spell_checked} (Correction {'On' if ENABLE_SPELL_CORRECTION else 'Off'})")
        print("✅ Rewritten Query:", rewritten)
        method = "Semantic"

        try:
            sem = collection.query.near_text(
                query=rewritten,
                distance=0.7,
                limit=10,
                return_metadata=["certainty"]
            )

            if sem and sem.objects:
                print(f"✅ Semantic results returned: {len(sem.objects)}")
                for obj in sem.objects:
                    certainty = getattr(obj.metadata, "certainty", 0)
                    preview = obj.properties.get("question", "")[:60]
                    print(f"🔷 Certainty: {certainty:.3f} | {preview}")

                objects = sorted(
                    [obj for obj in sem.objects if getattr(obj.metadata, "certainty", 0) >= 0.65],
                    key=lambda x: x.metadata.certainty,
                    reverse=True
                )
                print(f"🎯 High-certainty matches: {len(objects)}")
            else:
                print("⚠️ Semantic returned no results")
                objects = []

        except Exception as e:
            print("❌ Semantic search failed:", e)
            objects = []

        # ✅ Debug output
        print("✅ Rewritten Query:", rewritten)
        print("✅ Total Semantic Matches:", len(objects))
        for i, obj in enumerate(objects[:5]):
            print(f"{i+1}.", obj.properties.get("question", "")[:80])
        

        if objects:
            results = [obj.properties for obj in objects]
            
        else:
            method = "Fuzzy"
            tokens = normalize_tokens(raw_query)
            all_objs = collection.query.fetch_objects(limit=1000).objects
            results = []
            for obj in all_objs:
                text = obj.properties.get("combinedText", "").lower()
                if any(token in text for token in tokens):
                    results.append(obj.properties)

    results = results[:50]  # Limit to 50 results max

    # 🔍 Modified preview format: "1. question preview text"
    preview = [
        f"{idx + 1}. {q.get('question', '')[:50]}"
        for idx, q in enumerate(results)
    ]

    # 🔍 Clean full_data: exclude tags and combinedText
    full_data = {
        str(idx + 1): {k: v for k, v in q.items() if k not in ["tags", "combinedText"]}
        for idx, q in enumerate(results)
    }

    log_query(raw_query, raw_query, method, len(results))

    return {
        "preview": preview,
        "full_data": full_data
    }

class SaveApproachInput(BaseModel):
    user_id: str
    question_id: str
    custom_approach: str
    image_urls: list[str] = []  # ✅ Add this line

@app.post("/save-approach")
async def save_approach(data: SaveApproachInput):
    print("🔽 Saving approach:", data.dict())  # ✅ Add this line

    existing = await approach_collection.find_one({
        "user_id": data.user_id,
        "questionId": data.question_id
    })

    update_data = {
        "custom_approach": data.custom_approach,
        "image_urls": data.image_urls  # ✅ Preserve uploaded images
    }

    if existing:
        await approach_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": update_data}
        )
        print("✅ Updated existing record")
        return {"message": "Approach updated"}
    else:
        to_insert = {
            "user_id": data.user_id,
            "questionId": data.question_id,
            **update_data
        }
        await approach_collection.insert_one(to_insert)
        print("✅ Inserted:", to_insert)
        return {"message": "Approach saved"}

class SearchHistoryInput(BaseModel):
    user_id: str
    query: str
    level: str
    subject: str
    chapter: str
    results: list[dict]  # 🆕 Add this line

search_history_collection = db["search_history"]  # Add this near your MongoDB collections

@app.post("/save-search-history")
async def save_search_history(data: SearchHistoryInput):
    print("📥 Saving search:", data.dict())
    entry = {
        "user_id": data.user_id,
        "query": data.query,
        "level": data.level,
        "subject": data.subject,
        "chapter": data.chapter,
        "timestamp": datetime.now(),
        "results": data.results  # 🆕 Save full results
    }
    await search_history_collection.insert_one(entry)
    return {"message": "Search saved"}


@app.get("/get-approach")
async def get_approach(
    user_id: str = Query(..., alias="user_id"),
    question_id: str = Query(..., alias="question_id")
):
    record = await approach_collection.find_one({
        "user_id": user_id,
        "questionId": question_id
    })

    if record:
        return {
            "custom_approach": record.get("custom_approach", ""),
            "image_urls": record.get("image_urls", [])  # ✅ ADD THIS LINE 
        }
        
    else:
        return {
            "custom_approach": "",
            "image_urls": []  # ✅ ADD DEFAULT
        }

class RegisterInput(BaseModel):
    full_name: str
    email: str
    password: str
    exam_level: str


@app.post("/register")
async def register_user(data: RegisterInput):
    existing_user = await users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = pwd_context.hash(data.password)
    signup_date = datetime.now(UTC)
    trial_expiry = signup_date + timedelta(days=7)

    user_data = {
        "full_name": data.full_name,
        "email": data.email,
        "password": hashed_pw,
        "exam_level": data.exam_level,
        "signup_date": signup_date,
        "plan_expiry": trial_expiry,
        "paid": False,
        "role": "student"
    }

    await users_collection.insert_one(user_data)
    return {"message": "User registered successfully. Trial active for 7 days."}

class LoginInput(BaseModel):
    email: str
    password: str

class UserSettingsInput(BaseModel):
    user_id: str
    preferred_level: str = "CA Final"
    theme: str = "light"

@app.post("/update-settings")
async def update_user_settings(data: UserSettingsInput):
    await users_collection.update_one(
        {"_id": ObjectId(data.user_id)},
        {"$set": {
            "preferred_level": data.preferred_level,
            "theme": data.theme
        }},
        upsert=True
    )
    return {"message": "Settings updated"}

@app.get("/get-settings")
async def get_user_settings(user_id: str = Query(...)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)}, {"_id": 0, "preferred_level": 1, "theme": 1})
    if not user:
        return {"preferred_level": "CA Final", "theme": "light"}
    return user


@app.post("/login")
async def login_user(data: LoginInput):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "full_name": user["full_name"],
        "exam_level": user["exam_level"],
        "role": user.get("role", "student"),
        "plan_expiry": user.get("plan_expiry"),
        "paid": user.get("paid", False)
    }
@app.post("/upload-images")
async def upload_images(
    user_id: str = Query(...),
    question_id: str = Query(...),
    files: list[UploadFile] = File(...)
):
    # Validate image types
    valid_types = {"image/jpeg", "image/png", "image/webp"}
    total_size = 0
    uploaded_urls = []

    for file in files:
        if file.content_type not in valid_types:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
        
        content = await file.read()
        total_size += len(content)
        
        if total_size > 50 * 1024:
            raise HTTPException(status_code=400, detail="Total image size exceeds 50 KB")

        result = cloudinary.uploader.upload(content, folder=f"user_uploads/{user_id}/{question_id}")
        uploaded_urls.append(result["secure_url"])

    # 🔄 Update MongoDB
    await approach_collection.update_one(
        {"user_id": user_id, "questionId": question_id},
        {"$set": {"image_urls": uploaded_urls}},
        upsert=True
    )

    return {"message": "Images uploaded", "urls": uploaded_urls}


class AIRequest(BaseModel):
    query: str
    model: str  # 'openai', 'claude', or 'gemini'

@app.post("/ask-ai")
async def ask_ai(req: AIRequest):
    query = req.query
    model = req.model.lower()

    if model == "openai":

        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": query}
            ]
        )

        print(response.choices[0].message.content)
        
        return {"source": "ChatGPT", "response": response.choices[0].message.content.strip()}

    elif model == "claude":
        async with httpx.AsyncClient() as client:
            response = await client.post(
                 "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": os.getenv("CLAUDE_API_KEY"),
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-sonnet-20240229",
                    "max_tokens": 1024,
                    "messages": [{"role": "user", "content": query}]
                }
            )
            result = response.json()
            # ✅ Check if content exists
            if "content" in result:
                return {
                    "source": "Claude",
                    "response": result["content"][0]["text"]
                }
            else:
                return {
                    "source": "Claude",
                    "response": f"❌ Error: {result.get('error', {}).get('message', 'Unknown Claude error')}"
                }

    elif model == "gemini":
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={os.getenv('GEMINI_API_KEY')}",
                json={
                    "contents": [{"parts": [{"text": query}]}]
                }
            )
            result = response.json()
            if "candidates" in result:
                return {
                    "source": "Gemini",
                    "response": result["candidates"][0]["content"]["parts"][0]["text"]
                }
            else:
                return {
                    "source": "Gemini",
                    "response": f"❌ Error: {result.get('error', {}).get('message', 'Unknown error')}"
                }
            
class RAGRequest(BaseModel):
    question: str


@app.post("/rag-approach")
async def generate_rag_approach(req: RAGRequest):
    query = req.question.strip()

    # 🔍 Step 1: Vector search in Ca_rag_content
    try:
        embedder = OpenAIEmbeddings(model="text-embedding-3-small")
        query_vector = embedder.embed_query(query)

        ca_collection = client_weaviate_rag.collections.get("Ca_rag_content")
        result = ca_collection.query.near_vector(
            near_vector=query_vector,
            distance=0.7,
            limit=5,
            return_metadata=["certainty"]
        )
    except Exception as e:
        print("❌ Weaviate error:", str(e))
        raise HTTPException(status_code=500, detail="Weaviate vector search failed")

    chunks = []
    if result and result.objects:
        chunks = [obj.properties.get("text", "") for obj in result.objects]

    if not chunks:
        return {"response": "⚠️ No relevant material found to explain this question."}

    # 📩 Step 2: Build prompt for GPT
    formatted_chunks = "\n\n".join([f"[Chunk {i+1}]: {c}" for i, c in enumerate(chunks)])

    gpt_prompt = f"""
You are a CA Final tutor. A student is asking for help understanding how to approach the following question.

Use the material below to give a structured explanation, but **do not quote the text directly**. Instead, summarize and teach.

Material:
{formatted_chunks}

Question:
{query}
"""

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You're a professional CA Final tutor."},
                {"role": "user", "content": gpt_prompt}
            ],
            temperature=0.4
        )

        answer = response.choices[0].message.content.strip()
        return {"response": answer}

    except Exception as e:
        print("❌ OpenAI error:", str(e))
        raise HTTPException(status_code=500, detail="GPT processing failed")

@app.post("/rag-approach-cma")
async def generate_rag_approach(req: RAGRequest):
    query = req.question.strip()
    rag_class = "Cma_rag_content"  # 👈 Add this line

    # 🔍 Step 1: Vector search in Cma_rag_content
    try:
        embedder = OpenAIEmbeddings(model="text-embedding-3-small")
        query_vector = embedder.embed_query(query)

        cma_collection = client_weaviate_rag_cma.collections.get("Cma_rag_content")
        result = cma_collection.query.near_vector(
            near_vector=query_vector,
            distance=0.7,
            limit=5,
            return_metadata=["certainty"]
        )
    except Exception as e:
        print("❌ Weaviate error:", str(e))
        raise HTTPException(status_code=500, detail="Weaviate vector search failed")

    chunks = []
    if result and result.objects:
        chunks = [obj.properties.get("text", "") for obj in result.objects]

    if not chunks:
        return {"response": "⚠️ No relevant material found to explain this question."}

    # 📩 Step 2: Build prompt for GPT
    formatted_chunks = "\n\n".join([f"[Chunk {i+1}]: {c}" for i, c in enumerate(chunks)])

    gpt_prompt = f"""
You are a CMA Final tutor. A student is asking for help understanding how to approach the following question.

Use the material below to give a structured explanation, but **do not quote the text directly**. Instead, summarize and teach.

Material:
{formatted_chunks}

Question:
{query}
"""

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You're a professional CMA Final tutor."},
                {"role": "user", "content": gpt_prompt}
            ],
            temperature=0.4
        )

        answer = response.choices[0].message.content.strip()
        return {"response": answer}

    except Exception as e:
        print("❌ OpenAI error:", str(e))
        raise HTTPException(status_code=500, detail="GPT processing failed")

@app.post("/rag-approach-cs")
async def generate_rag_approach(req: RAGRequest):
    query = req.question.strip()
    rag_class = "Cs_rag_content"  # 👈 Add this line

    # 🔍 Step 1: Vector search in Cs_rag_content
    try:
        embedder = OpenAIEmbeddings(model="text-embedding-3-small")
        query_vector = embedder.embed_query(query)

        cs_collection = client_weaviate_rag_cs.collections.get("Cs_rag_content")
        result = cs_collection.query.near_vector(
            near_vector=query_vector,
            distance=0.7,
            limit=5,
            return_metadata=["certainty"]
        )
    except Exception as e:
        print("❌ Weaviate error:", str(e))
        raise HTTPException(status_code=500, detail="Weaviate vector search failed")

    chunks = []
    if result and result.objects:
        chunks = [obj.properties.get("text", "") for obj in result.objects]

    if not chunks:
        return {"response": "⚠️ No relevant material found to explain this question."}

    # 📩 Step 2: Build prompt for GPT
    formatted_chunks = "\n\n".join([f"[Chunk {i+1}]: {c}" for i, c in enumerate(chunks)])

    gpt_prompt = f"""
You are a CS Final tutor. A student is asking for help understanding how to approach the following question.

Use the material below to give a structured explanation, but **do not quote the text directly**. Instead, summarize and teach.

Material:
{formatted_chunks}

Question:
{query}
"""

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You're a professional CS Final tutor."},
                {"role": "user", "content": gpt_prompt}
            ],
            temperature=0.4
        )

        answer = response.choices[0].message.content.strip()
        return {"response": answer}

    except Exception as e:
        print("❌ OpenAI error:", str(e))
        raise HTTPException(status_code=500, detail="GPT processing failed")
    
@app.get("/icai-notifications")
async def get_icai_notifications():
    try:
        url = "https://www.icai.org/post/important-announcements"
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "lxml")

        # Grab top announcements
        items = soup.select("ul.list.list-icons li a")[:5]
        updates = [item.text.strip() for item in items if item.text.strip()]

        if not updates:
            updates = ["⚠️ No live announcements found."]

        return {
            "updates": updates,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    except Exception as e:
        print("❌ ICAI scrape failed:", str(e))
        return {
            "updates": ["❌ Failed to fetch ICAI updates"],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
@app.get("/get-search-history")
async def get_search_history(user_id: str = Query(...)):
    history = await search_history_collection.find({"user_id": user_id}).sort("timestamp", -1).to_list(50)
    return [
        {
            "query": item["query"],
            "level": item["level"],
            "subject": item["subject"],
            "chapter": item["chapter"],
            "timestamp": item["timestamp"].strftime("%Y-%m-%d %H:%M"),
        }
        for item in history
    ]
