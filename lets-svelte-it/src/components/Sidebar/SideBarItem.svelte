<script lang="ts">
  export let section = "";
  export let selected = false;
  export let setView: (name: string) => void;

  section = section.replace(/ /g, "_").toLowerCase();
</script>

<li class="my-1">
  {#if selected}
    <a
      class="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-800 hover:text-gray-200 active:bg-gray-900 active:text-gray-200"
      on:click={() => setView(section)}
      href="#{section}"><slot /></a
    >
  {:else}
    <a
      class="block py-2 px-4 rounded bg-gray-50 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:text-gray-900"
      on:click={() => setView(section)}
      href="#{section}"><slot /></a
    >
  {/if}
</li>

<style></style>
