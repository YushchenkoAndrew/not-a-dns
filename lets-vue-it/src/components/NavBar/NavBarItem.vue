<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href: string;
    target: string;
    name: string;
  }>(),
  {
    href: "",
    target: "_self",
  }
);
</script>

<template>
  <li>
    <a
      class="block rounded py-2 text-gray-400 hover:text-gray-50"
      href="{{props.href}}"
      target="{{props.target}}"
      aria-current="page"
      >{{ props.name }}</a
    >
  </li>
</template>

<style></style>
