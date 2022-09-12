import { defineStore } from 'pinia';

import { AppMode } from '../types';

import type {
  RecordData,
  ObjectLiteral,
  RecordTableType,
  AlertProps,
} from "../types";

export const defaultStore = defineStore("default", {
  state: () => ({
    mode: Number(localStorage.getItem("mode") ?? AppMode.dark),
    view: window.location.hash?.slice(1) || "general",

    action: null as null | AlertProps,

    record: JSON.parse(
      localStorage.getItem("record") as string
    ) as null | RecordTableType,
    records: (JSON.parse(localStorage.getItem("records") as string) ||
      []) as RecordData[],
  }),

  getters: {
    modeIcon(): string {
      return this.mode == AppMode.dark ? "fa-sun" : "fa-moon";
    },

    nextMode(): string {
      return AppMode[Number(!this.mode)];
    },

    submit(): boolean {
      if (
        !this.record?.data ||
        Object.keys(this.record.data).reduce(
          (acc, k) => acc || !this.record?.data?.[k],
          false
        )
      )
        return false;

      localStorage.setItem("record", JSON.stringify(this.record));
      return true;
    },
  },

  actions: {
    inverseMode() {
      this.mode = Number(!this.mode);
      localStorage.setItem("mode", this.mode + "");
    },

    changeView(v: string) {
      this.view = v;
    },

    loadRecords(data: ObjectLiteral[], name: string = "type") {
      const res = {} as { [key: string]: RecordData };
      for (const item of data) {
        const keys = Object.keys(item).filter((k) => item[k]);
        const key = keys.sort().join("_");

        if (!res[key]) {
          res[key] = {
            name: `${item[name]} `.toUpperCase() + "Records",
            keys,
            values: [],
          };
        }
        res[key].values.push(keys.map((k) => item[k]));
      }

      this.records = Object.values(res);
      localStorage.setItem("records", JSON.stringify(this.records));
    },

    selectRecord(index: number, data: ObjectLiteral) {
      this.record = { index, data };
    },

    resetRecord() {
      this.record = null;
      localStorage.removeItem("record");
    },

    setActionState(value: AlertProps | null) {
      this.action = value;
    },
  },
});
