import { defineStore } from 'pinia';

import { AppMode } from '../types';

import type { RecordData, ObjectLiteral, RecordTableType } from "../types";

export const defaultStore = defineStore("default", {
  state: () => ({
    mode: Number(localStorage.getItem("mode") ?? AppMode.dark),
    view: window.location.hash?.slice(1) || "general",
    submit: false,

    record: JSON.parse(
      localStorage.getItem("record") as string
    ) as null | RecordTableType,
    records: [
      {
        name: "A Records",
        keys: ["record", "name", "value", "ttl"],
        values: [
          ["example.com", "@", "192.168.1.2", 14400],
          // ["Shining Star", "Earth, Wind, and Fire", 1975],
        ],
      },
      {
        name: "AAAA Records",
        keys: ["Song", "Artist", "Year"],
        values: [
          [
            "The Sliding Mr. Bones (Next Stop, Pottersville)",
            "Malcolm Lockyer",
            1961,
          ],
          ["Witchy Woman", "The Eagles", 1972],
          ["Shining Star", "Earth, Wind, and Fire", 1975],
        ],
      },
      {
        name: "CNAME Records",
        keys: ["Song", "Artist", "Year"],
        values: [
          [
            "The Sliding Mr. Bones (Next Stop, Pottersville)",
            "Malcolm Lockyer",
            1961,
          ],
          ["Witchy Woman", "The Eagles", 1972],
          ["Shining Star", "Earth, Wind, and Fire", 1975],
        ],
      },
      {
        name: "PTR Records",
        keys: ["Song", "Artist", "Year"],
        values: [],
      },
      {
        name: "MX Records",
        keys: ["Song", "Artist", "Year"],
        values: [],
      },
      {
        name: "TXT Records",
        keys: ["Song", "Artist", "Year"],
        values: [],
      },
    ] as RecordData[],
  }),

  getters: {
    modeIcon(): string {
      return this.mode == AppMode.dark ? "fa-sun" : "fa-moon";
    },

    nextMode(): string {
      return AppMode[Number(!this.mode)];
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

    loadRecords(data: any) {
      // TODO:
    },

    selectRecord(index: number, data: ObjectLiteral) {
      this.record = { index, data };
      this.onRecordChange();
    },

    onRecordChange() {
      if (!this.record?.data) return;
      const keys = Object.keys(this.record.data);
      this.submit = keys.reduce(
        (acc, k) => acc || !this.record?.data?.[k],
        !keys.length
      );

      console.log(this.submit, this.record.data.Year);

      localStorage.setItem("record", JSON.stringify(this.record));
    },
  },
});
