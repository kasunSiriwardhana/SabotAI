<template>
  <div class="mt-[72px] flex w-full p-4 h-[calc(100vh-66px)] overflow-y-auto">
    <div class="mx-auto w-full lg:w-[720px] flex flex-col gap-8">
      <h1 class="font-bold text-2xl">Incident Details</h1>
      <div v-if="log" class="relative rounded-lg shadow-md p-4 flex flex-col gap-4">
        <h2 class="text-lg">
          Log Details
          <div class="flex gap-2">
            <!-- <div class="badge badge-neutral">{{ log.id }}</div> -->
            <div class="badge badge-ghost" :class="`bg-${bgColor}`">{{ errorText }}</div>
          </div>
        </h2>
        <div class="absolute w-full h-2 left-0 top-0 rounded-t-lg" :class="`bg-${bgColor}`"></div>
        <!-- changed because it is not an array anymore -->
        <img
          v-if="log.imageUrls"
          :src="log.imageUrls"
          class="rounded-lg bg-cover object-cover"
          alt="incidentimg"
        />
        <p class="text-sm text-neutral">{{ log.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import logService from '@/services/log.service';

export default {
  created() {
    const { obstructionId } = this.$route.params;
    this.getIncidentDetails(obstructionId);
  },
  data() {
    return {
      log: null,
    };
  },
  methods: {
    async getIncidentDetails(logId) {
      try {
        const log = await logService.getLog(logId);
        this.log = log;

        console.log(log);
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    log(newLog, oldLog) {
      if (newLog) {
        document.title = `${document.title} - ${newLog.id}`;
      }
    },
  },
  computed: {
    bgColor() {
      return this.log.clientError.twColor;
    },
    errorText() {
      return this.log.clientError.text;
    },
  },
};
</script>
