<script setup lang="ts">
import { SectionFormat } from "../../lib/string";
import { defaultStore } from "../../stores";

const props = defineProps<{
  label: string;
}>();

const store = defaultStore();
const section = SectionFormat(props.label);
</script>

<template>
  <p class="group text-2xl font-bold my-2">
    <a
      :name="section"
      class="text-gray-900 dark:text-white"
      :href="`#${section}`"
      @click="() => store.changeView(section)"
      >{{ props.label }}</a
    >
    <i
      class="fas fa-link ml-2 text-gray-600 dark:text-gray-400 invisible group-hover:visible"
    />
  </p>
</template>

<style></style>
