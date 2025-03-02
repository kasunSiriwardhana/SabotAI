import { db } from '@/config/firebase.config';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  query,
  serverTimestamp,
  Timestamp,
  collection,
  limit,
  getDocs,
} from 'firebase/firestore';

import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// workaround for create a new user without immediately signing in
import { firebaseConfig } from '@/config/firebase.config';
import { initializeApp, deleteApp } from 'firebase/app';

import { format } from 'date-fns';

class UserService {
  async getLastSeen() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;

    try {
      const snap = await getDoc(doc(db, 'users', uid));

      if (snap.exists()) {
        return snap.data().lastSeen;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async setLastSeen() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  // workaround for create a new user without immediately signing in
  // https://stackoverflow.com/a/38013551
  async createUser(email, password) {
    try {
      const tempApp = initializeApp(firebaseConfig, '_temp');

      const tempAuth = getAuth(tempApp);

      const userRef = await createUserWithEmailAndPassword(tempAuth, email, password);
      const { user } = userRef;

      // cleanup
      signOut(tempAuth);
      deleteApp(tempApp);

      // TODO: add user to collection
      console.log(user);

      const userDbRef = doc(db, 'users', user.uid);

      await setDoc(userDbRef, {
        createdAt: serverTimestamp(),
        lastSeen: Timestamp.fromMillis(0),
        email: user.email,
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers() {
    try {
      const users = [];
      const userRef = collection(db, 'users');
      const usersQuery = query(userRef, limit(10));

      const snapshot = await getDocs(usersQuery);

      snapshot.forEach((doc) => {
        const userData = doc.data();

        userData.createdAt = format(userData.createdAt.toDate(), 'yyyy-MM-dd');

        users.push({ id: doc.id, ...userData });
      });

      console.log(users);

      return users;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserService();
