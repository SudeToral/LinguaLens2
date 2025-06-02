from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.services.databases import Databases
import os

client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT", "https://fra.cloud.appwrite.io/v1")) \
      .set_project(os.getenv("APPWRITE_PROJECT_ID", "682a471d0022d1118481")) \
      .set_key(os.getenv("APPWRITE_API_KEY", "standard_d2b1f318f56118dfab99c3fd11bb737c3bee60f377b1b96ab4be98a6e73af8a384ba6ef64a6c133210d8df30603a228cc53354d5176eec5d64668b0f3d7303ff65b148d4c84d443ce56dca651128bf9274d6eb9765ce6016dfc77fbeb8bd632a065c36278a9c7c6706168e563929496fc6664fadcc2006da604822da173798af"))

storage = Storage(client)
databases = Databases(client)

# Constants for your project - better to store in env vars
BUCKET_ID = os.getenv("APPWRITE_BUCKET_ID", "6834cf58002581c4badd")
DB_ID = os.getenv("APPWRITE_DB_ID", "682b8dc8002b735ece29")
COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID", "6834cde500256bd6b773")