<script lang="ts">
  export let name = "";
  export let view = "";
  export let onClick = (s: string) => ((view = s), null);

  const section = name.replace(/ /g, "_").toLowerCase();
</script>

<li class="my-1">
  {#if section === view && section}
    <a
      class="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-800 hover:text-gray-200 active:bg-gray-900 active:text-gray-200 dark:bg-slate-900 dark:hover:bg-slate-700 dark:active:bg-gray-900 dark:active:text-gray-50"
      on:click={() => onClick(section)}
      href="#{section}"><slot />{name}</a
    >
  {:else}
    <a
      class="group cursor-pointer block py-2 px-4 rounded bg-gray-50 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-slate-700 dark:active:bg-slate-700 dark:active:text-gray-50"
      on:click={() => onClick(section)}
      href={(section && `#${section}`) || null}><slot />{name}</a
    >
  {/if}
</li>

<style></style>
