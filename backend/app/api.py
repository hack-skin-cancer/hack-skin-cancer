from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import random, string, os
from azure.core.credentials import AzureNamedKeyCredential
from azure.data.tables import TableClient
import json, requests
from datetime import datetime
import tfwriter

from azure.storage.queue import (
        QueueClient,
        BinaryBase64EncodePolicy,
        BinaryBase64DecodePolicy
)

settings = {}


def get_storage_cn():
    kv_name = "kvhack4skin"
    kv_uri = f"https://{kv_name}.vault.azure.net"
    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=kv_uri, credential=credential)
    secret = client.get_secret("storage-cn")
    return secret.value

app = FastAPI()

origins = [
    "http://localhost:8080",
    "localhost:8080",
    "http://hack-cancer-app.azurewebsites.net"
    "https://hack-cancer-app.azurewebsites.net",
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def load_settings():
    global settings
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    try:
        with open(os.path.join(__location__, 'appsettings.json')) as settings_data:
            appsettings = json.load(settings_data)
            settings = appsettings
    except Exception as e:
        print(f"There was an error reading appsettings from: {'appsettings.json'}")

    print(settings)
load_settings()

@app.get("/", tags=["root"])
async def read_root() -> dict:
    
    date_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    return {"message": "Welcome to the Hack-Cancer API!", "time":f"{date_time}", "vars":settings}


@app.post("/uploadImage/", tags=["ingest"])
async def upload_image(file: UploadFile)-> dict:
    """
        Uploads an image to the 'uploads container
        On Success: returns a Json Object:
            {'filename': <file_name>}
    """
    q_name = "upload-q"
    filename = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16))
    file_split_tup = os.path.splitext(file.filename)
    coded_filename = filename + file_split_tup[1]
    storage_cn = get_storage_cn()   #Get storage account connection string
    contents = await file.read()
    blob = BlobClient.from_connection_string(storage_cn, container_name="uploads", blob_name=coded_filename)
    blob.upload_blob(contents)

    # Drop message on a Queue
    queue_client = QueueClient.from_connection_string(storage_cn, q_name)
    queue_client.send_message(coded_filename)

    # Create and Upload TF Records File
    _location = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    tf_filename = os.path.join(_location, f"{filename}.tfrecords")
    tf_file_contents = tfwriter.write_tfrecord(tf_filename, coded_filename, contents)
    os.remove(tf_filename)  # Remote the TF File

    # Upload TFfile to Blob Storage
    blob = BlobClient.from_connection_string(storage_cn, container_name="uploads", blob_name=tf_filename)
    blob.upload_blob(tf_file_contents)

    queue_client = QueueClient.from_connection_string(storage_cn, q_name)
    queue_client.send_message(tf_filename)
    # -------

    response = {"Success": "File Uploaded","upload_filename": file.filename, "request_id": filename}
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