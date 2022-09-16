<script setup lang="ts">
import { defaultStore } from "../../stores";

const styles = {
  input: [
    "ring-red-300 focus:border-red-300 dark:ring-red-400 dark:focus:border-red-400",
    "ring-orange-300 focus:border-orange-300 dark:ring-orange-400 dark:focus:border-orange-400",
    "ring-green-300 focus:border-green-300 dark:ring-green-400 dark:focus:border-green-400",
    "ring-teal-300 focus:border-teal-300 dark:ring-teal-400 dark:focus:border-teal-400",
    "ring-indigo-300 focus:border-indigo-300 dark:ring-indigo-400 dark:focus:border-indigo-400",
    "ring-blue-300 focus:border-blue-300 dark:ring-blue-400 dark:focus:border-blue-400",
    "ring-yellow-200 focus:border-yellow-200 dark:ring-yellow-300 dark:focus:border-yellow-300",
  ],
};

const store = defaultStore();
</script>

<template>
  <tr v-if="store.record" class="text-gray-900 dark:text-gray-100">
    <td
      v-for="key in Object.keys(store.record.data)"
      class="px-4 py-5 dark:py-6"
    >
      <input
        :class="`pt-1 pb-1 px-3 w-5/6 ring-1 rounded-md dark:bg-gray-800 dark:focus:bg-gray-700 focus:outline-none border-b-2 border-transparent ${
          styles.input[store.record.index]
        }`"
        v-model="store.record.data[key]"
      />
      <!-- TODO:  -->
      <!-- <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
      Please provide a valid email address.
    </p> -->
    </td>
  </tr>
</template>

<style></style>
