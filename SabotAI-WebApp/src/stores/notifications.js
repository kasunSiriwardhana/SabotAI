import { defineStore } from 'pinia';

import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase.config';

import userService from '@/services/user.service';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifcations: [],
    seen: true,
    lastUpdated: null,
    unSubNotifications: null,
  }),
  actions: {
    async subscribe() {
      try {
        const userLastSeen = await userService.getLastSeen();

        const notifRef = collection(db, 'notifications');
        const notifQuery = query(notifRef, orderBy('createdAt'));

        this.unSubNotifications = onSnapshot(notifQuery, (snapshot) => {
          const notifications = [];

          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const notif = change.doc.data();
              notif.createdAt = notif.createdAt.toMillis();

              notifications.push(notif);
            }
          });

          const latestNotif = notifications.slice(-1)[0];
          if (latestNotif) {
            this.seen = userLastSeen.toMillis() > latestNotif.createdAt;
          }

          this.lastUpdated = new Date().toISOString();
          this.notifcations = this.notifcations.concat(notifications);
        });
      } catch (error) {
        console.log(error);
      }
    },
    unsubscribe() {
      if (this.unSubNotifications) {
        this.unSubNotifications();
      }
    },
    setToSeen() {
      this.seen = true;
    },
  },
  getters: {
    orderedNotifs() {
      const notifications = [...this.notifcations];
      return notifications.reverse();
    },
    isSeen() {
      return this.seen;
    },
  },
});
