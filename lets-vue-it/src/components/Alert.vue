<script setup lang="ts">
import { defaultStore } from "../stores";
import { AlertType } from "../types";

// NOTE: Maybe enable this thing one day ....
// const props = withDefaults(
//   defineProps<{
//     timeout: number;
//   }>(),
//   { timeout: 5000 }
// );

const store = defaultStore();
// const progress = reactive({ value: 0 });
// let iterval: NodeJS.Timer = null;

// $: {
//   if (status == AlertType.success && !iterval) {
//     progress ||= 100;
//     iterval = setInterval(() => {
//       if (progress - 100 / PROGRESS_STEP >= 0) {
//         return (progress -= 100 / PROGRESS_STEP);
//       }

//       clearInterval(iterval);
//       return setTimeout(() => onClose(), 0);
//     }, timeout / PROGRESS_STEP);
//   }
// }

// const PROGRESS_STEP = 50;
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

<template>
  <div v-if="store.action" class="fixed bottom-2 right-4">
    <div
      :class="`flex flex-col w-72 px-4 pt-3 my-2 rounded-xl dark:border-2 dark:bg-gray-700 ${
        styles[store.action.status].bg
      } dark:text-gray-50`"
    >
      <div class="flex">
        <div class="mr-auto">
          <div
            :class="`px-1 mb-2 font-bold dark:border-b-2 ${
              styles[store.action.status].title
            }`"
          >
            {{ store.action.title }}
          </div>
          <div class="flex flex-row">
            <div
              v-if="store.action.status == AlertType.pending"
              class="animate-bounce ml-1 mr-3 mt-3"
            >
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
            <i
              v-else-if="store.action.status == AlertType.success"
              class="fas fa-check my-auto mr-2"
            />
            <i
              v-else-if="store.action.status == AlertType.error"
              class="fas fa-minus my-auto mr-2"
            />
            <i v-else class="fad fa-question animate-ping text-xl mr-3" />
            <p class="my-auto">{{ store.action.desc }}</p>
          </div>
        </div>
        <div class="my-auto">
          <div
            :class="`text-2xl text-center px-1 rounded-full ${
              styles[store.action.status].close
            } dark:bg-gray-700 dark:hover:bg-gray-600`"
            @click="() => store.setActionState(null)"
          >
            <i class="fa-solid fa-xmark p-2" />
          </div>
        </div>
      </div>

      <!-- NOTE: Maybe enable this thing one day .... -->
      <!-- <div
        v-if="store.alert.status == AlertType.success"
        class="w-full bg-green-200 h-1 mt-4 mb-2"
      >
        <div class="bg-green-700 h-1" :style="`width: ${progress.value}%`" />
      </div> -->
      <span class="my-2" />
    </div>
  </div>
</template>

<style></style>
