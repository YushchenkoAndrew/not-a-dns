<script setup lang="ts">
import { defaultStore } from "../../stores";
import type { ObjectLiteral } from "../../types";

const props = withDefaults(
  defineProps<{
    index: number;
    keys: string[];
    values: any[][];
    modifier: string;
  }>(),
  {
    index: 0,
    modifier: "modify_record",
  }
);

const styles = {
  td: [
    "group-hover:decoration-red-300 dark:group-hover:decoration-red-400",
    "group-hover:decoration-orange-300 dark:group-hover:decoration-orange-400",
    "group-hover:decoration-green-300 dark:group-hover:decoration-green-400",
    "group-hover:decoration-teal-300 dark:group-hover:decoration-teal-400",
    "group-hover:decoration-indigo-300 dark:group-hover:decoration-indigo-400",
    "group-hover:decoration-blue-300 dark:group-hover:decoration-blue-400",
    "group-hover:decoration-yellow-200 dark:group-hover:decoration-yellow-300",
  ],
};

const store = defaultStore();

function onRecordSelect(record: ObjectLiteral) {
  store.selectRecord(props.index, record);
  const el = document.getElementsByName(props.modifier)?.[0];
  console.log(document.getElementsByName(props.modifier));

  if (el) el.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <tr
    v-for="row in props.values"
    class="group cursor-pointer text-gray-900 dark:text-gray-100"
    @click="
      () =>
        onRecordSelect(
          keys.reduce((acc, key, i) => ((acc[key] = row[i]), acc), {} as ObjectLiteral)
        )
    "
  >
    <td
      v-for="value in row"
      :class="`p-4 decoration-2 group-hover:underline ${
        styles.td[index] || ''
      }`"
    >
      {{ value }}
    </td>
  </tr>
</template>

<style></style>
