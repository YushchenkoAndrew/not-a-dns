<script lang="ts">
  import { AlertType } from "../../types";

  export let status = AlertType.pending;
  export let title: string;
  export let desc: string;

  const styles = {
    [AlertType.pending]: {
      bg: "bg-sky-500 dark:border-sky-500 text-gray-50",
      title: "dark:border-sky-500",
      close: "bg-sky-600 hover:bg-sky-700",
    },
    [AlertType.success]: {
      bg: "bg-green-500 dark:border-green-500 text-gray-50",
      title: "dark:border-green-500",
      close: "bg-green-600 hover:bg-green-700",
    },
    [AlertType.error]: {
      bg: "bg-red-500 dark:border-red-500 text-gray-50",
      title: "dark:border-red-500",
      close: "bg-red-600 hover:bg-red-700",
    },
    [AlertType.warning]: {
      bg: "bg-yellow-400 dark:border-yellow-400 text-gray-800",
      title: "dark:border-yellow-400",
      close: "bg-yellow-500 hover:bg-yellow-600",
    },
  };
</script>

<div
  class="flex w-72 p-4 rounded-xl dark:border-2 dark:bg-gray-700  {styles[
    status
  ].bg} dark:text-gray-50"
>
  <div class="mr-auto">
    <div class="px-1 mb-2 font-bold dark:border-b-2 {styles[status].title}">
      {title}
    </div>
    <div class="flex flex-row">
      {#if status == AlertType.pending}
        <div class="animate-bounce ml-1 mr-3 mt-3">
          <svg
            class="animate-spin w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      {:else if status == AlertType.success}
        <i class="fas fa-check my-auto mr-2" />
      {:else if status == AlertType.error}
        <i class="fas fa-minus my-auto mr-2" />
      {:else}
        <i class="fad fa-question animate-ping text-xl mr-3" />
      {/if}
      <p class="my-auto">{desc}</p>
    </div>
  </div>
  <div class="my-auto">
    <div
      class="text-2xl text-center px-1 rounded-full {styles[status]
        .close} dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <i class="fa-solid fa-xmark p-2" />
    </div>
  </div>
</div>

<style></style>
