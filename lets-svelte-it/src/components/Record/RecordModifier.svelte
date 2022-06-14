<script lang="ts">
  import type { Writable } from "svelte/store";

  import type { ObjectLiteral } from "../../types";

  import RecordLabel from "./RecordLabel.svelte";

  export let label: string;
  export let names: string[];
  export let keys: string[][];
  export let record: Writable<ObjectLiteral>;

  let disabled = true;
  record.subscribe((next: ObjectLiteral) => {
    const values = Object.values(next);
    disabled = values.reduce((acc, curr) => acc || !curr, !values.length);
  });

  const styles = {
    button: [
      "bg-red-300 hover:bg-red-400 dark:bg-transparent dark:text-red-400 hover:dark:bg-red-400 hover:dark:text-gray-50",
      "bg-orange-300 hover:bg-orange-400 dark:bg-transparent dark:text-orange-400 hover:dark:bg-orange-400 hover:dark:text-gray-50",
      "bg-green-300 hover:bg-green-400 dark:bg-transparent dark:text-green-400 hover:dark:bg-green-400 hover:dark:text-gray-800",
      "bg-teal-300 hover:bg-teal-400 dark:bg-transparent dark:text-teal-400 hover:dark:bg-teal-400 hover:dark:text-gray-800",
      "bg-indigo-300 hover:bg-indigo-400 dark:bg-transparent dark:text-indigo-400 hover:dark:bg-indigo-400 hover:dark:text-gray-50",
      "bg-blue-300 hover:bg-blue-400 dark:bg-transparent dark:text-blue-400 hover:dark:bg-blue-400 hover:dark:text-gray-50",
      "bg-yellow-200 hover:bg-yellow-300 dark:bg-transparent dark:text-yellow-300 hover:dark:bg-yellow-400 hover:dark:text-gray-50",
    ],
  };
</script>

<div
  class="flex flex-col mt-6 py-6 w-full border-t-2 border-gray-200 dark:border-gray-600"
>
  <RecordLabel {label} />

  <div
    class="flex flex-col border-2 border-gray-100 dark:border-gray-700  rounded-md py-1 px-2"
  >
    <p class="text-sm font-semibold mx-1 my-1 text-gray-900 dark:text-gray-200">
      Records
    </p>

    <!-- TODO: Change behavior on md & sm -->
    <div class="flex flex-row pb-4">
      <span class="mr-auto">
        {#each names as name, i}
          <button
            class="px-3 py-2 m-2 rounded-md {styles.button[i] ||
              ''} hover:drop-shadow-md dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >{name}</button
          >
        {/each}
        <!-- <button on:click={() => (disabled = !disabled)}>CLICK</button> -->
      </span>

      <button
        class="flex flex-row mx-3 my-auto px-3 py-2 rounded-md text-gray-50 bg-green-500 dark:bg-green-600  hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-yellow-200 disabled:dark:bg-gray-700 disabled:text-gray-600 disabled:dark:text-yellow-200"
        {disabled}
      >
        <i
          class="fas {disabled ? 'fa-minus' : 'fa-check'} my-auto mr-2"
        />Submit
      </button>
    </div>
  </div>

  <table class="border-b-2 {''} my-4 border-collapse table-auto">
    <thead class={`${""} dark:border-b-4`}>
      <tr>
        {#each keys[0] as key}
          <th
            class="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
            >{key}</th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-t-2 border-red-300 text-gray-900 dark:text-gray-100 w-1/2"
      >
        {#each Object.keys($record) as key}
          <td class="p-4">
            <input
              class="border-2 rounded-md border-gray-200 w-1/2"
              bind:value={$record[key]}
            />
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
  <!-- <p class="text-gray-900 dark:text-gray-100">Some text</p> -->
</div>

<style></style>
