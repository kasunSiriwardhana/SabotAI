<template>
  <div class="relative">
    <div class="flex select-none justify-between">
      <!-- input label -->
      <label v-if="label" :for="elementId" class="mb-2 block text-sm font-medium text-gray-900">{{
        label
      }}</label>
      <!-- error message -->
      <label v-if="error" :for="elementId" class="mb-2 block text-sm font-medium text-red-500">{{
        error
      }}</label>
    </div>
    <div>
      <!-- prepend icon -->
      <div
        v-if="hasPrependedIcon"
        @click="$emit('click:prepend')"
        class="absolute top-[42px] left-0 flex items-center pl-3 sm:top-10"
      >
        <fa-icon :icon="prependIcon" color="gray"></fa-icon>
      </div>
      <!-- append icon -->
      <div
        v-if="hasAppendedIcon"
        @click="$emit('click:append')"
        class="absolute top-[42px] right-0 flex cursor-pointer items-center pr-3 sm:top-10"
      >
        <fa-icon :icon="appendIcon" color="gray"></fa-icon>
      </div>
      <!-- input field -->
      <input
        class="text-field block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 outline-none focus:border-secondary sm:text-sm"
        @blur="$emit('blur')"
        v-model="innerValue"
        :data-append-icon="hasAppendedIcon"
        :data-prepend-icon="hasPrependedIcon"
        :data-error-state="hasError"
        :type="type"
        :name="name"
        :id="elementId"
        :placeholder="placeholder"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup>
// disabled -> + disabled css ✅
// error msg ✅
// id -> computed elementId, default nanoid ✅
// label ✅
// placeholder ✅
// type -> validate text,number,password ✅
// prepend icon ✅, @click ✅
// append icon ✅, @click ✅
// name ✅
// @input ✅
// @blur ✅

import { nanoid } from 'nanoid';
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue', 'blur', 'click:append', 'click:prepend']);
const props = defineProps({
  modelValue: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => {
      const validTypes = ['text', 'number', 'password'];
      return validTypes.includes(value.toLowerCase());
    },
  },
  name: {
    type: String,
    default: nanoid(10),
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  appendIcon: {
    type: String,
  },
  prependIcon: {
    type: String,
  },
});

const elementId = computed(() => {
  return props.name.toLowerCase().split(' ').join('-');
});

const innerValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const hasPrependedIcon = computed(() => {
  return props.prependIcon ? true : false;
});

const hasAppendedIcon = computed(() => {
  return props.appendIcon ? true : false;
});

const hasError = computed(() => {
  return props.error ? true : false;
});
</script>

<style>
@tailwind components;

@layer components {
  .text-field:disabled {
    @apply cursor-not-allowed bg-gray-200;
  }
  .text-field[data-append-icon='true'] {
    @apply pr-8;
  }
  .text-field[data-prepend-icon='true'] {
    @apply pl-8;
  }
  .text-field[data-error-state='true'] {
    @apply border-red-500 focus:border-red-500 focus:ring-0;
  }
}
</style>
