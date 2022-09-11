<script setup lang="ts">
import NavBar from "./components/NavBar/NavBar.vue";
import NavBarItem from "./components/NavBar/NavBarItem.vue";
import { CHAPTERS, NAV_BAR } from "./config";
import SideBar from "./components/Sidebar/SideBar.vue";
import SideBarItem from "./components/Sidebar/SideBarItem.vue";
import { CapitalizeString } from "./lib/string";
import { AppMode } from "./types";
import Index from "./components/Page/Index.vue";
import { defaultStore } from "./stores";
import SideBarChapter from "./components/Sidebar/SideBarChapter.vue";

const store = defaultStore();
</script>

<template>
  <div :class="AppMode[store.mode]">
    <div class="bg-gray-50 dark:bg-gray-800">
      <NavBar name="lets-dns-it">
        <NavBarItem
          v-for="options in NAV_BAR"
          :name="options.name"
          :href="options.href"
          :target="options.target"
        />
      </NavBar>

      <div class="flex flex-col sm:flex-row container mx-auto">
        <SideBar>
          <SideBarItem name="General">
            <i class="fa-solid fa-gear mr-3" />
          </SideBarItem>

          <SideBarChapter v-for="key in Object.keys(CHAPTERS)" :name="key">
            <SideBarItem v-for="{ icon, name } in CHAPTERS[key]" :name="name">
              <i :class="`fa-solid ${icon} mr-3`" />
            </SideBarItem>
          </SideBarChapter>

          <SideBarChapter name="settings">
            <SideBarItem name="Modify Record" bind:view>
              <i class="fa-solid fa-sliders mr-3" />
            </SideBarItem>

            <SideBarItem :onClick="store.inverseMode">
              <div
                class="group-hover:text-blue-600 dark:group-hover:text-yellow-200"
              >
                <i :class="`fas ${store.modeIcon} dar mr-3`" />
                {{ CapitalizeString(store.nextMode) }} Mode
              </div>
            </SideBarItem>
          </SideBarChapter>
        </SideBar>

        <Index />
      </div>

      <footer />
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
}
</style>
