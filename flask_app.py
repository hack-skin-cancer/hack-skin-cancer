
import os
from flask import Flask, request, jsonify
from melanoma_prediction import *
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
from azure.identity import DefaultAzureCredential


app = Flask(__name__)

###Code from Ruben
def get_storage_cn():
    kv_name = "kvhack4skin"
    kv_uri = f"https://{kv_name}.vault.azure.net"
    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=kv_uri, credential=credential)
    secret = client.get_secret("storage-cn")
    return secret.value

def download_blob(blob_to_download:str, file_name: str) -> str:
    storage_cn = get_storage_cn()
    blob_service_client = BlobServiceClient.from_connection_string(storage_cn)
    container_client = blob_service_client.get_container_client(container="uploads")
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    photo_path = os.path.join(__location__, file_name)
    download_file_path = photo_path

    with open(download_file_path, "wb") as file:
        file.write(container_client.download_blob(blob_to_download).readall())

    return photo_path
####End Code

@app.route('/')
def hello():
    return 'Hello, World!'
### Predecting Melanoma using the saved model locally
@app.route('/melanoma_predict', methods=['POST'])
def add_message():
    content = request.json
    print(content)
    path = download_blob(content['blob_name'],content['blob_name'])
    print(path)
    #pred_score = get_pred(content['path'])
    pred_score = get_pred(path)
    return jsonify({"pred_score": str(pred_score)})

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)




