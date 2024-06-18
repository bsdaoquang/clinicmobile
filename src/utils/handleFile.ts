import storage from '@react-native-firebase/storage';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { handleResize } from './resizeImage';


export class HandleFile {
  static Upload = async (file: ImageOrVideo) => {
    try {

      const filename = `image-${Date.now()}-` + (file.path ? file.path.split('/')[file.path.split('/').length - 1] : `image-${Date.now()}`);
      const filePath = `/images/${filename}`;
      const ref = storage().ref(filePath);
      await ref.putFile(file.path);
      const downloadUrl = await ref.getDownloadURL();

      return {
        filePath,
        downloadUrl
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}