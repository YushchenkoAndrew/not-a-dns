<script setup lang="ts">
import { SectionFormat } from "../../lib/string";

const props = withDefaults(
  defineProps<{
    name: string;
    view: string;
    // onClick: (s: string) => null;
  }>(),
  {
    name: "",
    view: "",
    // FIXME:
    // onClick: null
  }
);

// export let name = "";
// export let view = "";
// export let onClick = (s: string) => ((view = s), null);

const section = SectionFormat(props.name);
</script>

<template>
  <li class="my-1">
    <!-- @click="() => onClick(section)" -->
    <a
      v-if="section === props.view && section"
      class="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-800 hover:text-gray-200 active:bg-gray-900 active:text-gray-200 dark:bg-slate-900 dark:hover:bg-slate-700 dark:active:bg-gray-900 dark:active:text-gray-50"
      :href="`#${section}`"
      ><slot></slot>{{ props.name }}</a
    >
    <a
      v-else
      class="group cursor-pointer block py-2 px-4 rounded bg-gray-50 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-slate-700 dark:active:bg-slate-700 dark:active:text-gray-50"
      :href="(section && `#${section}`) || undefined"
      ><slot />{{ props.name }}</a
    >
  </li>
</template>

<style></style>
