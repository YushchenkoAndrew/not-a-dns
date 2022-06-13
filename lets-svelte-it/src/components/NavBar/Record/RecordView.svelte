<script lang="ts">
  import { BG_COLORS, BORDER_COLORS, DECORATION_COLORS } from "../../../config";

  import type { ObjectLiteral } from "../../../types";
  import RecordLabel from "./RecordLabel.svelte";

  export let index = 0;
  export let label: string;
  export let keys: string[];
  export let values: any[][];

  const record = keys.reduce(
    (acc, curr) => ({ ...acc, [curr]: "" }),
    {} as ObjectLiteral
  );

  const colorIndex =
    index % Math.min(BG_COLORS.length, DECORATION_COLORS.length);
</script>

<div class="flex flex-col my-6 w-full">
  <RecordLabel {label} />

  <table
    class="border-b-2 {BORDER_COLORS[colorIndex]} border-collapse table-auto"
  >
    <thead>
      <tr class={BG_COLORS[colorIndex]}>
        {#each keys as key}
          <th
            class="font-medium text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
            >{key}</th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each values as row}
        <tr
          class="group cursor-pointer text-gray-900 dark:text-gray-100 "
          on:click={() => keys.map((k, i) => (record[k] = row[i]))}
        >
          {#each Object.values(row) as value}
            <td
              class="p-4 decoration-2 group-hover:underline {DECORATION_COLORS[
                colorIndex
              ]}">{value}</td
            >
          {/each}
        </tr>
      {/each}

      <!-- <tr
        class="border-t-2 border-red-300 text-gray-900 dark:text-gray-100 w-1/2"
      >
        {#each Object.keys(record) as key}
          <td class="p-4">
            <input
              class="border-2 rounded-md border-gray-200 w-1/2"
              bind:value={record[key]}
            />
          </td>
        {/each}
      </tr> -->
    </tbody>
  </table>
</div>

<style></style>
