from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import random, string, os
from azure.core.credentials import AzureNamedKeyCredential
from azure.data.tables import TableClient
import json, requests
from azure.storage.queue import (
        QueueClient,
        BinaryBase64EncodePolicy,
        BinaryBase64DecodePolicy
)

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
    """
        Uploads an image to the 'uploads container
        On Success: returns a Json Object:
            {'filename': <file_name>}
    """
    q_name = "upload-q"
    filename = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    file_split_tup = os.path.splitext(file.filename)
    filename += file_split_tup[1]
    storage_cn = get_storage_cn()   #Get storage account connection string
    contents = await file.read()
    blob = BlobClient.from_connection_string(storage_cn, container_name="uploads", blob_name=filename)
    blob.upload_blob(contents)

    # Drop message on a Queue
    queue_client = QueueClient.from_connection_string(storage_cn, q_name)
    queue_client.send_message(filename)

    # Call ML API
    '''
    try:
        response = requests.post('PUT_URI_IN_HERE', data=contents, headers={'Content-Type': 'application/octet-stream'})
    except Exception:
        response = {"Error": "Error sending request","filename": file.filename }
    '''
    
    print(f"Random Filename: {filename}")
    print(f"Actual Filename: {file.filename}")
    #return {"filename": file.filename}
    return response


@app.get("/getResults/", tags=["results"])
async def get_results(request_id:str) -> dict:
    """
        Retrieves results based on the request_id submitted
        On success: returns json payload
        On Failure: returns an empty dictionary object as json
    """
    filter = f"request_id eq '{request_id}'"
    storage_cn = get_storage_cn()   #Get storage account connection string
    table_client = TableClient.from_connection_string(storage_cn, table_name = "results")
    entities = table_client.query_entities(
        query_filter=filter
    )
    entity = {}
    try:
        entity = entities.next()
        print(entity)
    # ...
    except StopIteration:
        None
    return json.dumps(entity)