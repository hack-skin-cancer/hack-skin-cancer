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

def write_tfrecord(tf_filename: str, image_name: str, image_string) -> str:


    with tf.io.TFRecordWriter(tf_filename) as writer:
      feature = {"raw_image": _create_bytes_feature(image_string)}#create a feature named values which contains the whole bytes array
      tf_example = tf.train.Example(features = tf.train.Features(feature=feature))#creates an example 
      writer.write(tf_example.SerializeToString())

    tf_file_content = None
    with open(tf_filename, mode='rb') as file:
      tf_file_content = file.read()

    #Return 
    return tf_file_content


if __name__ == "__main__":
  write_tfrecord()