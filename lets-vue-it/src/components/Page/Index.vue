<script setup lang="ts">
import RecordModifier from "../Record/RecordModifier.vue";
import RecordView from "../Record/RecordView.vue";
import RecordHead from "../Record/RecordHead.vue";
import RecordLabel from "../Record/RecordLabel.vue";
import { defaultStore } from "../../stores";
import type { DefaultResponse } from "../../types";
import { DNS_API } from "../../config";
import { loadRecord } from "../../lib/api";

document.title = "DNS Service";
const store = defaultStore();
setTimeout(async () => store.loadRecords(await loadRecord()), 0);
</script>

<template>
  <div class="w-full h-full p-4 overflow-y-auto">
    <div class="flex flex-col items-center justify-center py-2">
      <div class="flex flex-col mt-2 mb-6 w-full">
        <RecordLabel label="General" />
        <p class="text-gray-900 dark:text-gray-200">Simple DNS Server</p>
      </div>

      <RecordHead
        v-for="({ name, keys, values }, i) in store.records"
        :index="i"
        :label="name"
        :keys="keys"
      >
        <RecordView :index="i" :keys="keys" :values="values" />
      </RecordHead>

      <RecordModifier label="Modify Record" />
    </div>
  </div>
</template>

<style></style>
