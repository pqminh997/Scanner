import { Platform } from 'react-native';
import ListData from '../../mobx/global';
import { FirebaseConfig } from '../../firebase/config';
import RNFetchBlob from 'react-native-fetch-blob';

const storage = FirebaseConfig.storage();
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
const today = new Date();

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const Fetch = RNFetchBlob.polyfill.Fetch
// replace built-in fetch
window.fetch = new Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array, 
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type 
  // contains string `application/octet`.
  binaryContentTypes: [
    'image/',
    'video/',
    'audio/',
    'foo/',
  ]
}).build()

//up img len firebase storage
export const uploadImage = (
  uri,
  path = 'images',
  name = '',
  // mine = 'application/octet-stream',
) => {
  return new Promise((resolver, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;
    const imageRef = storage.ref(path);
    fs.readFile(uploadUri, 'base64')
      .then(data => {
        name != '' ? ListData.setIdImg(name) : ListData.setIdImg(Date.now().toString());
        return Blob.build(data, { type: 'application/octet-stream; BASE64' });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef
          .child(ListData.idImg)
          .put(blob, { contentType: 'application/octet-stream' });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.child(ListData.idImg).getDownloadURL();
      })
      .then(url => {
        resolver(url);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//get real time
export const time = () => {
  const date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + '  ' + time;
  return dateTime;
};
