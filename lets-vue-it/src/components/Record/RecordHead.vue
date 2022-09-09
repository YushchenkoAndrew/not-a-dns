<script setup lang="ts">
import RecordLabel from "./RecordLabel.vue";

const props = withDefaults(
  defineProps<{
    index: number;
    label: string;
    desc: string;
    keys: string[];
  }>(),
  {
    index: 0,
    desc: "",
  }
);

const styles = {
  table: [
    "border-red-300 dark:border-red-400",
    "border-orange-300 dark:border-orange-400",
    "border-green-300 dark:border-green-400",
    "border-teal-300 dark:border-teal-400",
    "border-indigo-300 dark:border-indigo-400",
    "border-blue-300 dark:border-blue-400",
    "border-yellow-200 dark:border-yellow-300",
  ],

  thead: [
    "bg-red-300 dark:bg-transparent dark:border-red-400",
    "bg-orange-300 dark:bg-transparent dark:border-orange-400",
    "bg-green-300 dark:bg-transparent dark:border-green-400",
    "bg-teal-300 dark:bg-transparent dark:border-teal-400",
    "bg-indigo-300 dark:bg-transparent dark:border-indigo-400",
    "bg-blue-300 dark:bg-transparent dark:border-blue-400",
    "bg-yellow-200 dark:bg-transparent dark:border-yellow-300",
  ],
};
</script>

<template>
  <div class="flex flex-col my-6 w-full">
    <RecordLabel :label="props.label" />

    <p v-if="desc" class="mb-3 text-gray-900 dark:text-gray-200">
      {{ props.desc }}
    </p>

    <table
      :class="`border-b-2 ${
        styles.table[props.index] || ''
      } border-collapse table-auto`"
    >
      <thead :class="`${styles.thead[props.index] || ''} dark:border-b-4`">
        <tr>
          <th
            v-for="key in props.keys"
            class="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<style></style>
