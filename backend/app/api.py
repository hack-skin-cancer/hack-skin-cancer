from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import random, string, os

def get_storage_cn():
    kv_name = "kvhack4skin"
    kv_uri = f"https://{kv_name}.vault.azure.net"
    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=kv_uri, credential=credential)
    secret = client.get_secret("storage-cn")
    return secret.value

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get('/eat', tags=["ingest"])
def consume() -> dict:
    return {"data":"Yes I can consume this too!"}

def configure():
    None

configure()

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Hello World, I'm an API!"}


@app.get("/upload", tags=["ingest"])
async def upload_picture() -> dict:
    return {"data": "Whoo hoo!"}


@app.post("/uploadImage/", tags=["ingest"])
async def upload_image(file: UploadFile):
# Upload an image
    filename = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    file_split_tup = os.path.splitext(file.filename)
    filename += file_split_tup[1]
    storage_cn = get_storage_cn()   #Get storage account connection string
    contents = await file.read()
    blob = BlobClient.from_connection_string(storage_cn, container_name="uploads", blob_name=filename)
    blob.upload_blob(contents)
    print(f"Random Filename: {filename}")
    print(f"Actual Filename: {file.filename}")
    return {"filename": file.filename}