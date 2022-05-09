<script lang="ts">
  export let selection = "";
  export let selected = false;
</script>

<li class="my-1">
  {#if selected}
    <a
      class="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-900 hover:text-gray-200"
      href="#{selection}"><slot /></a
    >
  {:else}
    <a
      class="block py-2 px-4 rounded bg-gray-50 text-gray-800 hover:bg-gray-200"
      href="#{selection}"><slot /></a
    >
  {/if}
</li>

<style></style>
