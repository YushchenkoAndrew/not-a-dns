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
  import RecordView from "../components/NavBar/Record/RecordView.svelte";
  import RecordLabel from "../components/NavBar/Record/RecordLabel.svelte";

  export let data: { name: string; keys: string[]; values: any[][] }[];
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
      <RecordView {index} label={name} {keys} {values} />
    {/each}

    <!-- TODO:  Create RecordModifier -->
    <div class="flex flex-col mt-6 py-6 w-full border-t-2 border-gray-200">
      <RecordLabel label="Modify Record" />
      <p class="text-gray-900 dark:text-gray-100">Some text</p>
    </div>
  </div>
</div>

<style></style>
