<template>
  <div class="absolute top-[66px] flex w-full p-4">
    <div class="mx-auto w-full lg:w-[720px] flex flex-col gap-8">
      <h1 class="font-bold text-2xl">Camera Summary</h1>
      <div class="flex flex-col gap-4">
        <h2 class="text-lg">
          Camera Details
          <div v-if="camera" class="badge badge-ghost">{{ camera.id }}</div>
        </h2>
        <div v-if="camera" class="shadow-md rounded-md sm:rounded-lg p-4">
          <div class="flex flex-col gap-2 w-full max-w-sm">
            <div class="flex w-full">
              <p class="font-medium">Camera ID</p>
              <p class="ml-auto">{{ camera.id }}</p>
            </div>
            <div class="flex w-full">
              <p class="font-medium">Name</p>
              <p class="ml-auto">{{ camera.name }}</p>
            </div>
            <div class="flex w-full">
              <p class="font-medium">Location</p>
              <p class="ml-auto">{{ camera.locationName }}</p>
            </div>
            <div class="flex w-full">
              <p class="font-medium">Description</p>
              <p class="ml-auto">{{ camera.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <h2 class="text-lg">Incidents</h2>
        <simple-table
          :headers="headers"
          :items="logs"
          @row-click="viewDetails"
          :loading="logsLoading"
        ></simple-table>
      </div>
    </div>
  </div>
</template>

<script>
import cameraService from '@/services/camera.service';
import logService from '@/services/log.service';

import SimpleTable from '@/components/SimpleTable.vue';

export default {
  components: {
    SimpleTable,
  },
  created() {
    const { cameraId } = this.$route.params;

    this.getCameraDetails(cameraId);
  },
  data() {
    return {
      camera: null,
      logs: [],

      logsLoading: true,

      headers: [
        {
          text: 'Date',
          value: 'createdAt',
          type: 'data',
        },
        {
          text: 'Description',
          value: 'desc',
          type: 'data',
        },
        {
          text: 'Error',
          value: 'errorType',
          type: 'status',
        },
      ],
    };
  },
  methods: {
    async getCameraDetails(cameraId) {
      try {
        const [cameraRes, logRes] = await Promise.allSettled([
          cameraService.getCamera(cameraId),
          logService.getLogsByCamera(cameraId),
        ]);

        if (cameraRes.status === 'rejected') {
          throw new Error(cameraRes.reason);
        } else {
          this.camera = cameraRes.value;
          console.log(cameraRes.value);
        }

        if (logRes.status === 'rejected') {
          throw new Error(logRes.reason);
        } else {
          this.logs = logRes.value;
          console.log(logRes.value);
          this.logsLoading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    viewDetails(item) {
      console.log(item);
      this.$router.push({
        name: 'ViewObstructionDetails',
        params: { cameraId: item.camId, obstructionId: item.id },
      });
    },
  },
  watch: {
    camera(newCamera, oldCamera) {
      if (newCamera) {
        document.title = `${document.title} - ${newCamera.id}`;
      }
    },
  },
};
</script>
