import os
import tensorflow as tf
from PIL import Image
from __future__ import _int
import numpy as  np
from utils import make_dirs

def convert_to_tfrecord(pairs, outdir, name):
    make_dirs(outdir)

    writer = tf.python_io.TFRecordWriter(os.path.join(outdir, name))
    print('Writing', name)
    for image_path, label_path in pairs:
        image = np.array(Image.open(image_path))
        label = np.array(Image.open(label_path))
        height = image.shape[0]
        width = image.shape[1]

        image_raw = image.tostring()
        label_raw = label.tostring()

        example = tf.train.Example(features=tf.train.Features(feature={
            'height': _int64_feature(height),
            'width': _int64_feature(width),
            'image_raw': _bytes_feature(image_raw),
            'label_raw': _bytes_feature(label_raw)}))
        writer.write(example.SerializeToString())
    writer.close() 


def _bytes_feature(value):
  """Returns a bytes_list from a string / byte."""
  if isinstance(value, type(tf.constant(0))):
    value = value.numpy() # BytesList won't unpack a string from an EagerTensor.
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def _float_feature(value):
  """Returns a float_list from a float / double."""
  return tf.train.Feature(float_list=tf.train.FloatList(value=[value]))

def _int64_feature(value):
  """Returns an int64_list from a bool / enum / int / uint."""
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))