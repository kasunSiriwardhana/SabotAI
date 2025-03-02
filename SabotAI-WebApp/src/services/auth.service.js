import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { generateErrorMessage } from '@/utils/handlers';

import { useNotificationsStore } from '@/stores/notifications';

const notifStore = useNotificationsStore();

const ERROR_CODES = {
  LOGIN: {
    'auth/user-not-found': 'User account does not exist',
    'auth/wrong-password': 'Incorrect password',
    'auth/network-request-failed': 'Please check your internet connection and try again',
    generic: 'Login failed. Please try again',
  },
};

class AuthService {
  async login(email, password) {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      notifStore.subscribe();
    } catch (error) {
      const errorMessage = generateErrorMessage(ERROR_CODES, 'login', error.code);
      throw new Error(errorMessage, { cause: error });
    }
  }

  async logout() {
    try {
      notifStore.unsubscribe();

      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.log(error.code);
    }
  }
}

export default new AuthService();
