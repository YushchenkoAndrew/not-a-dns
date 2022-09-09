<script setup lang="ts">
import NavBar from "./components/NavBar/NavBar.vue";
import NavBarItem from "./components/NavBar/NavBarItem.vue";
import { CHAPTERS, NAV_BAR } from "./config";
import SideBar from "./components/Sidebar/SideBar.vue";
import SideBarItem from "./components/Sidebar/SideBarItem.vue";
import { CapitalizeString } from "./lib/string";
import { AppMode } from "./types";
import Index from "./components/Page/Index.vue";

let mode = AppMode.dark;
let view = "general";
</script>

<template>
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
        <SideBarItem name="General" v-bind:view="view">
          <i class="fa-solid fa-gear mr-3" />
        </SideBarItem>

        <SideBarChapter v-for="key in Object.keys(CHAPTERS)" :name="key">
          <SideBarItem
            v-for="{ icon, name } in CHAPTERS[key]"
            :name="name"
            v-bind:view="view"
          >
            <i :class="`fa-solid ${icon} mr-3`" />
          </SideBarItem>
        </SideBarChapter>

        <SideBarChapter name="settings">
          <SideBarItem name="Modify Record" bind:view>
            <i class="fa-solid fa-sliders mr-3" />
          </SideBarItem>

          <SideBarItem>
            <div
              class="group-hover:text-blue-600 dark:group-hover:text-yellow-200"
            >
              <i
                :class="`fas ${
                  mode == AppMode.dark ? 'fa-sun' : 'fa-moon'
                } dar mr-3`"
              />
              {{ CapitalizeString(AppMode[Number(!mode)]) }} Mode
            </div>
          </SideBarItem>
        </SideBarChapter>
      </SideBar>

      <Index />
    </div>

    <footer />
  </div>
</template>

<style scoped></style>
