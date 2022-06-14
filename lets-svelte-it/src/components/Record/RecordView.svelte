<script lang="ts">
  import type { Writable } from "svelte/store";

  import type { ObjectLiteral } from "../../types";

  import RecordLabel from "./RecordLabel.svelte";

  export let index = 0;
  export let label: string;
  export let keys: string[];
  export let values: any[][];
  export let record: Writable<ObjectLiteral>;

  const styles = {
    table: [
      "border-red-300 dark:border-red-400",
      "border-orange-300 dark:border-orange-400",
      "border-green-300 dark:border-green-400",
      "border-teal-300 dark:border-teal-400",
      "border-indigo-300 dark:border-indigo-400",
      "border-blue-300 dark:border-blue-400",
      "border-yellow-200 dark:border-yellow-300",
    ],

    thead: [
      "bg-red-300 dark:bg-transparent dark:border-red-400",
      "bg-orange-300 dark:bg-transparent dark:border-orange-400",
      "bg-green-300 dark:bg-transparent dark:border-green-400",
      "bg-teal-300 dark:bg-transparent dark:border-teal-400",
      "bg-indigo-300 dark:bg-transparent dark:border-indigo-400",
      "bg-blue-300 dark:bg-transparent dark:border-blue-400",
      "bg-yellow-200 dark:bg-transparent dark:border-yellow-300",
    ],

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

<div class="flex flex-col my-6 w-full">
  <RecordLabel {label} />

  <table
    class="border-b-2 {styles.table[index] || ''} border-collapse table-auto"
  >
    <thead class={`${styles.thead[index] || ""} dark:border-b-4`}>
      <tr>
        {#each keys as key}
          <th
            class="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
            >{key}</th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each values as row}
        <tr
          class="group cursor-pointer text-gray-900 dark:text-gray-100 "
          on:click={() =>
            ($record = keys.reduce(
              (acc, key, i) => ({ ...acc, [key]: row[i] }),
              {}
            ))}
        >
          {#each Object.values(row) as value}
            <td
              class="p-4 decoration-2 group-hover:underline {styles.td[index] ||
                ''}">{value}</td
            >
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
