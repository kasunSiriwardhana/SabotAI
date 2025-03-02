import { db } from '@/config/firebase.config';
import { doc, collection, query, getDoc, getDocs, where, orderBy, limit } from 'firebase/firestore';

import errors from '@/config/error.config';
import { format } from 'date-fns';
class LogService {
  async getLog(logId) {
    try {
      const logRef = doc(db, 'logs', logId);
      const docSnap = await getDoc(logRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        return { id: docSnap.id, ...docData, clientError: errors[docData.errorType] };
      } else {
        throw new Error(`A log does not exist for id ${logId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getLogsByCamera(cameraId) {
    try {
      const logs = [];

      const logRef = collection(db, 'logs');
      const logQuery = query(
        logRef,
        where('camId', '==', cameraId),
        orderBy('createdAt', 'desc'),
        limit(10),
      );

      const logSnapshot = await getDocs(logQuery);

      logSnapshot.forEach((doc) => {
        const logData = doc.data();

        logData.createdAt = format(logData.createdAt.toDate(), 'yyyy-MM-dd | HH:mm:ss');

        logs.push({ id: doc.id, ...logData, clientError: errors[logData.errorType] });
      });

      console.log(logs);

      return logs;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new LogService();
