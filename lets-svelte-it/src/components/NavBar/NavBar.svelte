<script lang="ts">
  export let name: string;

  let collapse = true;
  const onCollapse = (v: boolean) => (collapse = v);
</script>

<nav class="px-2 sm:px-4 py-2.5 bg-gray-800">
  <div class="container flex flex-wrap justify-between items-center mx-auto">
    <span
      class="self-center text-xl px-3 font-bold whitespace-nowrap text-gray-50"
      >{name}</span
    >
    <button
      type="button"
      class="inline-flex sm:hidden items-center rounded-lg p-2 ml-3 text-gray-400 hover:bg-gray-700 focus:outline-none"
      on:click={() => onCollapse(!collapse)}
    >
      <span class="sr-only">Open main menu</span>
      <svg
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        /></svg
      >
      <svg
        class="hidden w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg
      >
    </button>

    <div class="{collapse ? 'hidden' : ''} w-full sm:block sm:w-auto">
      <ul
        class="flex flex-col sm:flex-row mt-4 sm:space-x-8 sm:mt-0 sm:text-sm sm:font-medium"
      >
        <slot />
      </ul>
    </div>
  </div>
</nav>

<style></style>
