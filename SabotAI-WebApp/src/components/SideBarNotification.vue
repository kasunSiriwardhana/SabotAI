<template>
  <div
    class="relative bg-base-100 border border-gray-200 rounded-lg p-2 cursor-pointer hover:shadow-lg hover:border-gray-300"
  >
    <div class="absolute w-full h-2 bg-warning left-0 top-0 rounded-t-lg"></div>
    <h1 class="font-bold text-lg">{{ title }}</h1>
    <p class="text-md">{{ description }}</p>
    <span class="text-sm text-gray-500">{{ $toRelativeDate(createdAt) }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>
