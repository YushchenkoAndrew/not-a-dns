<script lang="ts">
  export let name;
</script>

<hr class="mb-1 mt-4 border-gray-200" />
<li class="px-3">
  <p class="mt-3 mb-1 font-semibold text-gray-900">{name}</p>
</li>

<li class="pl-2 flex flex-col"><slot /></li>

<style></style>
