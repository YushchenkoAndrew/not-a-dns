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
  import Record from "../components/Record.svelte";

  export let data: { name: string; keys: string[]; values: any[][] }[];
</script>

<svelte:head>
  <title>DNS Service</title>
</svelte:head>

<div class="w-full h-full p-4 m-8 overflow-y-auto">
  <div class="flex flex-col items-center justify-center py-2">
    <div class="flex flex-col my-6 w-full">
      <p class="group text-2xl font-bold my-2">
        <a name="general" href="#general">General</a>
        <i class="fas fa-link text-gray-600 invisible group-hover:visible" />
      </p>
      <p>Some text</p>
    </div>

    {#each data as { name, keys, values }, index}
      <Record {index} section={name} {keys} {values} />
    {/each}
  </div>
</div>

<style></style>
