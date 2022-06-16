<script lang="ts">
  import type { Writable } from "svelte/store";
  import { SectionFormat } from "../../lib/string";

  import type {
    DefaultResponse,
    RecordData,
    RecordTableType,
  } from "../../types";
  import Alert from "../Alert/Alert.svelte";
  import RecordHead from "./RecordHead.svelte";
  import RecordInput from "./RecordInput.svelte";

  import RecordLabel from "./RecordLabel.svelte";

  export let label: string;
  export let data: RecordData[];
  export let record: Writable<RecordTableType>;

  let disabled = true;
  record.subscribe(({ data }: RecordTableType) => {
    const values = Object.values(data);
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

  async function onSubmit() {
    try {
      const res = await fetch("/dns/api/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify($record.data),
      });

      const response = (await res.json()) as DefaultResponse;
      if (response.status == "ERR" || !Array.isArray(response.result)) {
        // TODO: Display an error
        return;
      }

      const name = SectionFormat(data[$record.index].name);
      const el = document.getElementsByName(name)?.[0];
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 0);

      data = response.result;
      $record = { index: 0, data: {} };
    } catch (err) {
      // TODO: Display an error
    }
  }
</script>

<div
  id="#test"
  class="flex flex-col mt-6 py-6 w-full border-t-2 border-gray-200 dark:border-gray-600"
>
  <RecordLabel {label} />

  <div
    class="flex flex-col border-2 border-gray-100 dark:border-gray-700  rounded-md py-1 px-2"
  >
    <p class="text-sm font-semibold mx-1 my-1 text-gray-900 dark:text-gray-200">
      Records
    </p>

    <!-- FIXME: Change behavior on md & sm -->
    <div class="flex flex-row pb-4">
      <span class="mr-auto">
        {#each data as { name, keys }, i}
          <button
            class="px-3 py-2 m-2 rounded-md {styles.button[i] ||
              ''} hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            on:click={() =>
              ($record = {
                index: i,
                data: keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
              })}>{name}</button
          >
        {/each}
      </span>

      <button
        class="flex flex-row mx-3 my-auto px-3 py-2 rounded-md hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none disabled:hover:scale-100 disabled:hover:drop-shadow-none disabled:active:scale-100 text-gray-50 bg-green-500 dark:bg-green-600  hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-yellow-200 disabled:dark:bg-gray-700 disabled:text-gray-600 disabled:dark:text-yellow-200"
        {disabled}
        on:click={onSubmit}
      >
        <i
          class="fas {disabled ? 'fa-minus' : 'fa-check'} my-auto mr-2"
        />Submit
      </button>
    </div>
  </div>

  {#if Object.keys($record.data).length}
    <!-- TODO: Add pop up window -->

    <div
      class="flex flex-col border-2 border-gray-100 dark:border-gray-700 rounded-md pb-5 px-5 my-2"
    >
      <RecordHead
        index={$record.index}
        label={data[$record.index].name}
        keys={Object.keys($record.data)}
      >
        <RecordInput {record} />
      </RecordHead>
    </div>
  {/if}
</div>

<!-- TODO: Use AlertStack !! -->
<Alert title="title" desc="desc" />

<style></style>
