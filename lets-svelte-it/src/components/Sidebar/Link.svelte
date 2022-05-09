<script lang="ts">
  export let name: string;
  export let href: string;
</script>

<li>
  <a
    class="flex items-center text-lg px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md "
    {href}
  >
    <span class="mx-4 font-medium">{name}</span>
  </a>
</li>
