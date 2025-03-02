<template>
  <div>
    <side-bar>
      <nav-bar></nav-bar>
      <main>
        <router-view :key="$route.fullPath" />
      </main>
    </side-bar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';

export default {
  components: {
    NavBar,
    SideBar,
  },
};
</script>
