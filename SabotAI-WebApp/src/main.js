import '@/config/firebase.config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import '@/main.css';
import 'leaflet/dist/leaflet.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/router';

import '@/plugins/fa-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import datefmt from '@/utils/datefmt';

import { useNotificationsStore } from './stores/notifications';

let app;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);
    app.component('fa-icon', FontAwesomeIcon);
    app.use(createPinia());
    app.use(router);
    app.use(datefmt);
    app.mount('#app');

    if (user) {
      const notifStore = useNotificationsStore();
      notifStore.subscribe();
    }
  }
});
