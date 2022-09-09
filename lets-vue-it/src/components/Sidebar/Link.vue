<script setup lang="ts">
const props = defineProps<{
  name: string;
  href: string;
}>();
</script>

<template>
  <li>
    <a
      class="flex items-center text-lg px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
      href="{{props.href}}"
    >
      <span class="mx-4 font-medium">{{ props.name }}</span>
    </a>
  </li>
</template>
