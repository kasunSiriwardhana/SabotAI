<template>
  <div class="navbar fixed z-50 bg-base-100/80 backdrop-blur border border-b-gray-300">
    <div class="flex-1">
      <!-- sidebar toggle -->
      <div>
        <label for="nav-drawer" class="bg-transparent p-4 cursor-pointer" @click="updateLastSeen">
          <span
            :class="isSeen ? 'hidden' : ''"
            class="absolute left-9 top-6 inline-flex h-2 w-2 rounded-full bg-error"
          ></span>
          <fa-icon icon="bell" size="lg"></fa-icon>
          <span class="sr-only">toggle navigation drawer</span>
        </label>
      </div>

      <!-- branding -->
      <router-link :to="{ name: 'Dashboard' }">
        <h1 class="text-lg font-bold">SabotAI</h1>
      </router-link>
    </div>
    <div class="flex-none gap-2">
      <nav-bar-profile></nav-bar-profile>
    </div>
  </div>
</template>

<script>
import NavBarProfile from './NavBarProfile.vue';

import userService from '@/services/user.service';
import { useNotificationsStore } from '@/stores/notifications';

export default {
  components: {
    NavBarProfile,
  },
  setup() {
    const notificationsStore = useNotificationsStore();

    return { notificationsStore };
  },
  methods: {
    async updateLastSeen() {
      try {
        this.notificationsStore.setToSeen();
        await userService.setLastSeen();
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    isSeen() {
      return this.notificationsStore.isSeen;
    },
  },
};
</script>
