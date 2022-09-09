<script setup lang="ts">
import type { RecordData, RecordTableType } from "../../types";
import RecordModifier from "../Record/RecordModifier.vue";
import RecordView from "../Record/RecordView.vue";
import RecordHead from "../Record/RecordHead.vue";

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

const record = {} as RecordTableType;
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
      <RecordHead
        v-for="({ name, keys, values }, index) in data"
        :index="index"
        :label="name"
        :keys="keys"
        ><RecordView
          :index="index"
          :keys="keys"
          :values="values"
          :record="record"
      /></RecordHead>

      <!-- FIXME: -->
      <!-- <RecordModifier label="Modify Record" :data="data" :record="record" /> -->
    </div>
  </div>
</template>

<style></style>
