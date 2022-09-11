<script setup lang="ts">
import { defaultStore } from "../../stores";
import type { AlertProps, ObjectLiteral } from "../../types";
import RecordInput from "./RecordInput.vue";
import RecordHead from "./RecordHead.vue";
import RecordLabel from "./RecordLabel.vue";

const props = defineProps<{
  label: string;
}>();

let alert: AlertProps | null = null;
// let disabled = true;
// record.subscribe(() => {
// });

const styles = {
  button: [
    "bg-red-300 hover:bg-red-400 dark:text-red-400 hover:dark:bg-red-400 hover:dark:text-gray-50",
    "bg-orange-300 hover:bg-orange-400 dark:text-orange-400 hover:dark:bg-orange-400 hover:dark:text-gray-50",
    "bg-green-300 hover:bg-green-400 dark:text-green-400 hover:dark:bg-green-400 hover:dark:text-gray-800",
    "bg-teal-300 hover:bg-teal-400 dark:text-teal-400 hover:dark:bg-teal-400 hover:dark:text-gray-800",
    "bg-indigo-300 hover:bg-indigo-400 dark:text-indigo-400 hover:dark:bg-indigo-400 hover:dark:text-gray-50",
    "bg-blue-300 hover:bg-blue-400 dark:text-blue-400 hover:dark:bg-blue-400 hover:dark:text-gray-50",
    "bg-yellow-200 hover:bg-yellow-300 dark:text-yellow-300 hover:dark:bg-yellow-400 hover:dark:text-gray-50",
  ],
};

const store = defaultStore();

async function onSubmit() {
  // try {
  //   alert = {
  //     title: "Creating new Record",
  //     desc: "Loading ...",
  //     status: AlertType.pending,
  //   };
  //   const res = await fetch("/dns/api/record", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(props.record.data),
  //   });
  //   const response = (await res.json()) as DefaultResponse;
  //   if (response.status == "ERR") {
  //     return (alert = {
  //       ...alert,
  //       desc: response.message,
  //       status: AlertType.error,
  //     });
  //   }
  //   const name = SectionFormat(props.data[props.record.index].name);
  //   const el = document.getElementsByName(name)?.[0];
  //   if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 0);
  //   props.data = response.result;
  //   props.record = { index: 0, data: {} };
  //   alert = {
  //     ...alert,
  //     desc: "New record was added",
  //     status: AlertType.success,
  //   };
  // } catch (err) {
  //   alert = {
  //     ...alert,
  //     desc: "Server Side error: " + String(err),
  //     status: AlertType.error,
  //   };
  // }
}
</script>

<template>
  <div
    id="#test"
    class="flex flex-col mt-6 py-6 w-full border-t-2 border-gray-200 dark:border-gray-600"
  >
    <RecordLabel :label="props.label" />

    <div
      class="flex flex-col border-2 border-gray-100 dark:border-gray-700 rounded-md py-1 px-2"
    >
      <p
        class="text-sm font-semibold mx-1 my-1 text-gray-900 dark:text-gray-200"
      >
        Records
      </p>

      <!-- FIXME: Change behavior on md & sm -->
      <div class="flex flex-row pb-4">
        <span class="mr-auto">
          <button
            v-for="({ name, keys }, i) in store.records"
            :class="`px-3 py-2 m-2 rounded-md ${
              styles.button[i] || ''
            } hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none dark:bg-gray-700 text-gray-900 dark:text-gray-200`"
            @click="() => store.selectRecord(i, keys.reduce((acc, k) => (acc[k] = '', acc), {} as ObjectLiteral))"
          >
            {{ name }}
          </button>
        </span>

        <button
          class="flex flex-row mx-3 my-auto px-3 py-2 rounded-md hover:scale-105 hover:drop-shadow-md active:scale-100 active:drop-shadow-none disabled:hover:scale-100 disabled:hover:drop-shadow-none disabled:active:scale-100 text-gray-50 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-yellow-200 disabled:dark:bg-gray-700 disabled:text-gray-600 disabled:dark:text-yellow-200"
          :disabled="store.submit"
          @click="onSubmit"
        >
          <i
            :class="`fas ${
              store.submit ? 'fa-check' : 'fa-minus'
            } my-auto mr-2`"
          />Submit
        </button>
      </div>
    </div>

    <div
      v-if="store.record && Object.keys(store.record.data).length"
      class="flex flex-col border-2 border-gray-100 dark:border-gray-700 rounded-md pb-5 px-5 my-2"
    >
      <RecordHead
        :index="store.record.index"
        :label="store.records[store.record.index].name"
        :keys="Object.keys(store.record.data)"
      >
        <RecordInput />
      </RecordHead>
    </div>
  </div>

  <!-- TODO: Use AlertStack !! -->
  <!-- <Alert
    v-if="alert"
    :status="alert.status"
    :title="alert.title"
    :desc="alert.desc"
    :onClose="() => (alert = null)"
  /> -->
</template>

<style></style>
