<script lang="ts">
  export let href = "";
  export let target = "_self";
  export let name;
</script>

<li>
  <a
    class="block rounded py-2 text-gray-400 hover:text-gray-50"
    {href}
    {target}
    aria-current="page">{name}</a
  >
</li>

<style></style>
