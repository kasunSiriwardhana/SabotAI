<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img src="@/assets/profile.png" />
      </div>
    </label>
    <div class="mt-3 p-2 z-50 shadow menu menu-sm dropdown-content rounded-box w-52 bg-base-100">
      <ul tabindex="0" class="">
        <li><router-link :to="{ name: 'Settings' }">Settings</router-link></li>
        <li class="text-error" @click="logout"><a>Logout</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  methods: {
    async logout() {
      try {
        await authService.logout();
        this.$router.replace({
          name: 'Login',
        });

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
