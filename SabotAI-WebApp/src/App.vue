<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import LayoutBlank from '@/layouts/Blank.vue';

import { watch, shallowRef } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'AppLayout',
  setup() {
    const layout = shallowRef(LayoutBlank);
    const route = useRoute();
    watch(
      () => route.meta,
      async (meta) => {
        try {
          const component = await import(`@/layouts/${meta.layout}.vue`);
          layout.value = component?.default || LayoutBlank;
        } catch (e) {
          layout.value = LayoutBlank;
        }
      },
      { immediate: true },
    );
    return { layout };
  },
};
</script>
