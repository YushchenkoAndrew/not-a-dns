<script context="module" lang="ts">
  // export const prerender = true;
  export async function load() {
    return {
      props: {
        data: [
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
        ],
      },
    };
  }
</script>

<script lang="ts">
  import RecordView from "../components/Record/RecordView.svelte";
  import RecordLabel from "../components/Record/RecordLabel.svelte";
  import RecordModifier from "../components/Record/RecordModifier.svelte";
  import type { ObjectLiteral } from "../types";
  import { writable } from "svelte/store";

  export let data: { name: string; keys: string[]; values: any[][] }[];

  const names = data.map(({ name }) => name);
  const keys = data.map(({ keys }) => keys);
  let record = writable<ObjectLiteral>({});
</script>

<svelte:head>
  <title>DNS Service</title>
</svelte:head>

<div class="w-full h-full p-4 overflow-y-auto">
  <div class="flex flex-col items-center justify-center py-2">
    <div class="flex flex-col mt-2 mb-6 w-full">
      <RecordLabel label="General" />
      <p class="text-gray-900 dark:text-gray-100">Some text</p>
    </div>

    {#each data as { name, keys, values }, index}
      <RecordView {index} label={name} {keys} {values} bind:record />
    {/each}

    <RecordModifier label="Modify Record" {keys} {names} bind:record />
  </div>
</div>

<style></style>
