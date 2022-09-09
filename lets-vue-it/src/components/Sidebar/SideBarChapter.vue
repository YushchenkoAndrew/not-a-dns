<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <hr class="mb-1 mt-4 border-gray-200" />
  <li class="px-3">
    <p class="mt-3 mb-1 font-semibold text-gray-900 dark:text-gray-50">
      {{ props.name }}
    </p>
  </li>

  <li class="pl-2 flex flex-col"><slot /></li>
</template>

<style></style>
