<template>
  <div class="drawer">
    <input v-model="sidebar" id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="nav-drawer" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 h-full bg-base-200 text-base-content space-y-6">
        <h1 class="text-2xl font-bold">Notifications</h1>
        <div class="flex flex-col gap-4">
          <side-bar-notification
            v-for="notification in notifications"
            :title="notification.title"
            :description="notification.description"
            :created-at="notification.createdAt"
            @click="viewDetails(notification)"
          ></side-bar-notification>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { useNotificationsStore } from '@/stores/notifications';

import SideBarNotification from './SideBarNotification.vue';

export default {
  setup() {
    const notificationsStore = useNotificationsStore();

    return { notificationsStore };
  },
  components: {
    SideBarNotification,
  },
  data() {
    return {
      sidebar: false,
    };
  },
  methods: {
    viewDetails(notification) {
      const { camId, logId } = notification;

      this.sidebar = false;

      this.$router.push({
        name: 'ViewObstructionDetails',
        params: { cameraId: camId, obstructionId: logId },
      });
    },
  },
  computed: {
    notifications() {
      return this.notificationsStore.orderedNotifs;
    },
  },
};
</script>
