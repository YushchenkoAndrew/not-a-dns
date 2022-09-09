<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps<{ name: string }>();
const store = reactive({ collapse: true });
</script>

<template>
  <nav class="px-2 relative z-10 sm:px-4 py-2.5 bg-gray-800 dark:bg-slate-900">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <span
        class="self-center text-xl px-3 font-bold whitespace-nowrap text-gray-50"
        >{{ props.name }}</span
      >
      <button
        type="button"
        class="inline-flex sm:hidden items-center rounded-lg p-2 ml-3 text-gray-400 hover:bg-gray-700 focus:outline-none"
        @click="() => (store.collapse = !store.collapse)"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div
        :class="`${store.collapse ? 'hidden' : ''} w-full sm:block sm:w-auto`"
      >
        <ul
          class="flex flex-col sm:flex-row sm:space-x-8 mt-3 sm:mt-0 ml-3 sm:ml-0 sm:text-sm sm:font-medium"
        >
          <slot />
        </ul>
      </div>
    </div>
  </nav>
</template>

<style></style>
