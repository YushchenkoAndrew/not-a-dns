<script setup lang="ts">
import { SectionFormat } from "../../lib/string";

const props = defineProps<{
  label: string;
}>();

// FIXME:
let name: string;
name = SectionFormat(props.label);
</script>

<template>
  <p class="group text-2xl font-bold my-2">
    <a
      :name="{ name }"
      class="text-gray-900 dark:text-white"
      :href="`#${name}`"
      >{{ props.label }}</a
    >
    <i
      class="fas fa-link text-gray-600 dark:text-gray-400 invisible group-hover:visible"
    />
  </p>
</template>

<style></style>
