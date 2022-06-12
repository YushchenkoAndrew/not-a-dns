<script lang="ts"></script>

<!-- // FIXME: ON sm display table correctly !!! -->
<div class="flex flex-col p-4 text-gray-900 w-full sm:w-96 sm:h-screen">
  <p
    class="text-xl font-bold whitespace-nowrap text-gray-800 dark:text-gray-50 hidden fixed sm:block sm:top-8"
  >
    lets-dns-it
  </p>
  <ul class="flex flex-wrap flex-col mb-auto sm:fixed">
    <slot />
  </ul>
</div>

<style></style>
