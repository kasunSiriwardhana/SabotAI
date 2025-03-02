import { db } from '@/config/firebase.config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

class CameraService {
  async getAllCameras() {
    try {
      const docs = [];
      const snapshot = await getDocs(collection(db, 'cameras'));

      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      return docs;
    } catch (error) {
      console.log(error);
    }
  }

  async getCamera(cameraId) {
    try {
      const docRef = doc(db, 'cameras', cameraId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error(`A camera does not exist for id ${cameraId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CameraService();
