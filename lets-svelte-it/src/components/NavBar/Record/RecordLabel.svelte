<script lang="ts">
  import { SectionFormat } from "../../../lib/string";

  export let label: string;

  const name = SectionFormat(label);
</script>

<p class="group text-2xl font-bold my-2">
  <a {name} class="text-gray-900 dark:text-white" href="#{name}">{label}</a>
  <i
    class="fas fa-link text-gray-600 dark:text-gray-400 invisible group-hover:visible"
  />
</p>

<style></style>
