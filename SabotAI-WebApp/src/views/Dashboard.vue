<template>
  <div class="relative h-screen">
    <camera-map :cameras="cameras" @click:marker="handleMarkerClick"></camera-map>
  </div>
</template>

<script>
import CameraMap from '@/components/CameraMap.vue';

import cameraService from '@/services/camera.service';

export default {
  components: {
    CameraMap,
  },
  data() {
    return {
      cameras: [],
    };
  },
  created() {
    this.getCameras();
  },
  methods: {
    async getCameras() {
      try {
        this.cameras = await cameraService.getAllCameras();
      } catch (error) {
        console.log(error);
      }
    },
    handleMarkerClick(e) {
      //console.log(e);
      const { camera } = e;

      this.$router.push({
        name: 'ViewCameraSummary',
        params: { cameraId: camera.id },
      });
    },
  },
};
</script>
