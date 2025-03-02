<template>
  <div class="tb relative overflow-x-auto shadow-md rounded-md sm:rounded-lg">
    <table class="w-full text-left text-sm text-gray-500">
      <thead class="border-secondary bg-neutral text-xs uppercase text-white">
        <tr>
          <th v-for="header in headers" :key="header.value" scope="col" class="py-3 px-6">
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item"
          @click="$emit('row-click', item)"
          class="cursor-pointer border-b bg-white hover:bg-gray-50"
        >
          <td v-for="header in headers" :key="item[header.value]" scope="row" class="py-4 px-6">
            <div
              v-if="header.type === 'status'"
              :class="statusColor(item[header.value])"
              class="mr-2 inline-block h-2.5 w-2.5 rounded-full"
            >
              <div class="ml-4 my-auto">
                {{ errors[item[header.value]].text }}
              </div>
            </div>
            <div v-if="header.value != 'errorType'">{{ item[header.value] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="flex flex-col items-center justify-center p-4 text-gray-700">
      Loading...
    </div>
    <div
      v-else-if="!loading && items.length === 0"
      class="flex flex-col items-center justify-center p-4 text-gray-700"
    >
      No data to show
    </div>
  </div>
</template>

<script>
import errors from '@/config/error.config';

export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errors,
      config: {
        0: 'bg-error',
        1: 'bg-orange-500',
        2: 'bg-warning',
      },
    };
  },
  methods: {
    orderedItem(item) {
      const orderedItem = [];

      this.headers.forEach((header) => {
        orderedItem.push(item[header.value]);
      });

      return orderedItem;
    },
    statusColor(key) {
      return this.config[key];
    },
  },
};
</script>
