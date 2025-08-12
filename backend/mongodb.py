from pymongo import MongoClient

# Replace this with your actual connection string
MONGO_URI = "mongodb+srv://posttohariganta:94cBJfNagwdTNOZ7@cluster0.oxlqlpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)

# Define the DB and collection
db = client["approachDB"]
collection = db["userApproaches"]
