import os, glob
import tensorflow as tf
from PIL import Image
import numpy as  np


def _create_bytes_feature(value):
  """Returns a bytes_list from a string / byte."""
  if isinstance(value, type(tf.constant(0))):
    value = value.numpy() # BytesList won't unpack a string from an EagerTensor.
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def _create_float_feature(value):
  """Returns a float_list from a float / double."""
  return tf.train.Feature(float_list=tf.train.FloatList(value=[value]))

def _create_int64_feature(value):
  """Returns an int64_list from a bool / enum / int / uint."""
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def write_tfrecord():    
    _location = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    record_file = os.path.join(_location, 'my_tfrec.tfrecords')
    _location = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__), 'images'))
    list_files = glob.glob(_location + os.sep + "*.jpg")
    labels = [0, 1]
    images_labels = {
        list_files[0] : labels[0],
        list_files[1] : labels[1],
    }
    with tf.io.TFRecordWriter(record_file) as writer:
        for filename, label in images_labels.items(): 
                image_string = open(filename, 'rb').read()#reads each image in list in bytes format
                feature = {"raw_image": _create_bytes_feature(image_string),#create a feature named values which contains the whole bytes array
                        "label": _create_int64_feature(label) } #create a feature named label which contains 0 or 1
                tf_example = tf.train.Example(features = tf.train.Features(feature=feature))#creates an example 
                writer.write(tf_example.SerializeToString())


write_tfrecord()