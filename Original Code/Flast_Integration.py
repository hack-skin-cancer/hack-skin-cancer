INTEGRATION WITH FLASK
from future import division, print_function
# coding=utf-8
import sys
import os
import glob
import re
import numpy as np
from PIL import Image as pil_image
import cv2
# Keras
from tensorflow.keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer
app = Flask( name )
Model=load_model(r&#39;C:\Users\DELL\OneDrive\Documents\melanoma\dataset\models\mel.h5&#39;)
Model.compile(loss = &#39;binary_crossentropy&#39;, optimizer = &#39;adam&#39;, metrics = [&#39;accuracy&#39;])
classes = [&#39;Melanoma&#39;,&#39;Not Melanoma&#39;]

def model_predict(img_path,fname, Model):
img = PIL.Image.open(img_path)
#cv2.imwrite(fname, img)

32

#window_name=&#39;image&#39;
#cv2.imshow(window_name,img)
img = img.resize((128, 128))
img=np.asarray(img).reshape(-1,128,128,3)
img=img.astype(&#39;float32&#39;)
img /=255.0
result = Model.predict_classes(img)
# print(result[0])
return classes[int(x[0])]
@app.route(&#39;/&#39;, methods=[&#39;GET&#39;,&#39;POST&#39;])
def about():
# Main page
return render_template(&#39;about.html&#39;)
@app.route(&#39;/about.html&#39;, methods=[&#39;GET&#39;,&#39;POST&#39;])
def about1():
return render_template(&#39;about.html&#39;)
@app.route(&#39;/index.html&#39;, methods=[&#39;GET&#39;,&#39;POST&#39;])
def index():
# Main page
return render_template(&#39;index.html&#39;)
@app.route(&#39;/predict&#39;, methods=[&#39;POST&#39;])
def upload():
if request.method == &#39;POST&#39;:
# Get the file from post request
f = request.files[&#39;file&#39;]
# Save the file to ./uploads

32

basepath = r&#39;C:\Users\DELL\OneDrive\Documents\melanoma dataset&#39;
file_path = os.path.join(
basepath, &#39;uploads/&#39;,secure_filename(f.filename))
f.save(file_path)
# Make prediction
preds = model_predict(file_path ,secure_filename(f.filename), Model)
return str(preds)
return None
if name == &#39; main &#39;:
app.run(debug=True,use_reloader=False)