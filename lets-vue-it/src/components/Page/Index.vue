<script setup lang="ts">
import type { RecordData } from "../../types";

const data: RecordData[] = [
  {
    name: "A Records",
    keys: ["record", "name", "value", "ttl"],
    values: [
      ["example.com", "@", "192.168.1.2", 14400],
      // ["Shining Star", "Earth, Wind, and Fire", 1975],
    ],
  },
  {
    name: "AAAA Records",
    keys: ["Song", "Artist", "Year"],
    values: [
      [
        "The Sliding Mr. Bones (Next Stop, Pottersville)",
        "Malcolm Lockyer",
        1961,
      ],
      ["Witchy Woman", "The Eagles", 1972],
      ["Shining Star", "Earth, Wind, and Fire", 1975],
    ],
  },
  {
    name: "CNAME Records",
    keys: ["Song", "Artist", "Year"],
    values: [
      [
        "The Sliding Mr. Bones (Next Stop, Pottersville)",
        "Malcolm Lockyer",
        1961,
      ],
      ["Witchy Woman", "The Eagles", 1972],
      ["Shining Star", "Earth, Wind, and Fire", 1975],
    ],
  },
  {
    name: "PTR Records",
    keys: ["Song", "Artist", "Year"],
    values: [],
  },
  {
    name: "MX Records",
    keys: ["Song", "Artist", "Year"],
    values: [],
  },
  {
    name: "TXT Records",
    keys: ["Song", "Artist", "Year"],
    values: [],
  },
];

// let record = writable<RecordTableType>({
//   index: 0,
//   data: {} as ObjectLiteral,
// });
</script>

<!-- <svelte:head>
  <title>DNS Service</title>
</svelte:head> -->

<template>
  <div class="w-full h-full p-4 overflow-y-auto">
    <div class="flex flex-col items-center justify-center py-2">
      <div class="flex flex-col mt-2 mb-6 w-full">
        <RecordLabel label="General" />
        <p class="text-gray-900 dark:text-gray-200">Some text</p>
      </div>
      <!-- 
      {#each data as { name, keys, values }, index}
      <RecordHead {index} label="{name}" {keys}
        ><RecordView {index} {keys} {values} bind:record
      /></RecordHead>
      {/each}

      <RecordModifier label="Modify Record" bind:data bind:record /> -->
    </div>
  </div>
</template>

<style></style>
