<script lang="ts">
  export let name: string;
  export let data: { keys: string[]; values: any[][] };
</script>

<div class="flex flex-col">
  <!-- TODO: Add section -->
  <h1>{name}</h1>
  <table class="border-collapse table-auto w-full">
    <thead>
      <tr>
        {#each data.keys as key}
          <th
            class="border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-left"
            >{key}</th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data.values as row}
        <tr>
          {#each Object.values(row) as value}
            <td class="border-b border-slate-700 p-4 pl-8">{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style></style>
