from turtle import st
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import random, string, os
from azure.core.credentials import AzureNamedKeyCredential
from azure.data.tables import TableClient
from azure.data.tables import TableServiceClient
import json, requests
from datetime import datetime
#import app.tf_writer

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
    print(f"Uplaoded blob to: {blob.url}")

    # Drop message on a Queue
    #queue_client = QueueClient.from_connection_string(storage_cn, q_name)
    #queue_client.send_message({"filename":coded_filename, "url": blob.url})

    # Call REST API
    response = None
    try:
        api_url = "http://20.169.250.11:5000/melanoma_predict"
        headers = {'Content-type': 'application/json'}
        json_payload = {"request_id":filename, "blob_name": coded_filename}
        response = requests.post(api_url, json.dumps(json_payload), headers=headers)
        print(f"----> Response: {response}")
        prediction = save_results(filename, response)
    except Exception as e:
        print({"Error": {response}, "Exception:":e})

    response = {"Success": "File Uploaded","upload_filename": file.filename, "request_id": filename, "prediction":prediction['pred_score']}

    print(f"Random Filename: {filename}")
    print(f"Actual Filename: {file.filename}")
    #return {"filename": file.filename}
    return response


#@app.get("/saveResults", tags=["results"])
def save_results(request_id:str, results:str) -> {}:
    success = False
    filter = f"request_id eq '{request_id}'"
    storage_cn = get_storage_cn()
    try:
        tmp = results.text
        tmp = tmp.replace('\n', '')
        tmp = json.loads(tmp)
        tmp['PartitionKey'] = request_id
        tmp['RowKey'] = request_id
        tmp['request_id'] = request_id

        table_service_client = TableServiceClient.from_connection_string(conn_str=storage_cn)
        table_client = table_service_client.get_table_client(table_name="results")
        #table_client = TableClient.from_connection_string(storage_cn, table_name = "results")
        entity = table_client.create_entity(entity=tmp)
        success = True
    except Exception as e:
        print(f"Exception writing to Table: {e}")    
    
    return {"success:": success, "prediction": tmp['pred_score']}


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



async def download_blob(blob_to_download:str, file_name: str) -> str:
    storage_cn = get_storage_cn()
    blob_service_client = BlobServiceClient.from_connection_string(storage_cn)
    container_client = blob_service_client.get_container_client(container="uploads")
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    photo_path = os.path.join(__location__, file_name)
    download_file_path = photo_path

    with open(download_file_path, "wb") as file:
        file.write(container_client.download_blob(blob_to_download).readall())

    return photo_path