<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Record from "../components/Record.svelte";
</script>

<svelte:head>
  <title>DNS Service</title>
</svelte:head>

<div class="w-full h-full p-4 m-8 overflow-y-auto">
  <div class="flex items-center justify-center py-2">
    <Record
      name="A Records"
      data={{
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
      }}
    />
  </div>
</div>

<style></style>
