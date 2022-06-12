<script lang="ts">
  import { BG_COLORS, DECORATION_COLORS } from "../constant";

  export let index = 0;
  export let section: string;
  export let keys: string[];
  export let values: any[][];
  const name = section.replace(/ /g, "_").toLowerCase();

  index %= BG_COLORS.length;
</script>

<div class="flex flex-col my-6 w-full">
  <p class="group text-2xl font-bold my-2">
    <a {name} href="#{name}">{section}</a>
    <i class="fas fa-link text-gray-600 invisible group-hover:visible" />
  </p>

  <table class="border-collapse table-auto">
    <thead>
      <tr class={BG_COLORS[index]}>
        {#each keys as key}
          <th class="font-medium px-4 py-2 text-left">{key}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each values as row}
        <tr
          class="group cursor-pointer"
          on:click={() => console.log("HELLO WORLD")}
        >
          {#each Object.values(row) as value}
            <td
              class="p-4 decoration-2 group-hover:underline {DECORATION_COLORS[
                index
              ]}">{value}</td
            >
          {/each}
        </tr>
      {/each}

      <tr>
        {#each keys as key}
          <!-- TODO: -->
          <td
            class="p-4 decoration-2 group-hover:underline {DECORATION_COLORS[
              index
            ]}">{key}</td
          >
        {/each}
      </tr>
    </tbody>
  </table>
</div>

<style></style>
