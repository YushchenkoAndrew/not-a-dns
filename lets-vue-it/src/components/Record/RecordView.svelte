<script lang="ts">
  import type { Writable } from "svelte/store";

  import type { RecordTableType } from "../../types";

  export let index = 0;
  export let keys: string[];
  export let values: any[][];
  export let record: Writable<RecordTableType>;
  export let modifier = "modify_record";

  const styles = {
    td: [
      "group-hover:decoration-red-300 dark:group-hover:decoration-red-400",
      "group-hover:decoration-orange-300 dark:group-hover:decoration-orange-400",
      "group-hover:decoration-green-300 dark:group-hover:decoration-green-400",
      "group-hover:decoration-teal-300 dark:group-hover:decoration-teal-400",
      "group-hover:decoration-indigo-300 dark:group-hover:decoration-indigo-400",
      "group-hover:decoration-blue-300 dark:group-hover:decoration-blue-400",
      "group-hover:decoration-yellow-200 dark:group-hover:decoration-yellow-300",
    ],
  };
</script>

{#each values as row}
  <tr
    class="group cursor-pointer text-gray-900 dark:text-gray-100 "
    on:click={() => {
      $record = {
        index,
        data: keys.reduce((acc, key, i) => ({ ...acc, [key]: row[i] }), {}),
      };

      const el = document.getElementsByName(modifier)?.[0];
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }}
  >
    {#each Object.values(row) as value}
      <td
        class="p-4 decoration-2 group-hover:underline {styles.td[index] || ''}"
        >{value}</td
      >
    {/each}
  </tr>
{/each}

<style>
</style>
