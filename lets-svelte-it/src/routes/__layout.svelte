<script lang="ts">
  import "../app.css";
  import { page, session } from "$app/stores";
  import SideBar from "../components/Sidebar/SideBar.svelte";
  import SideBarChapter from "../components/Sidebar/SideBarChapter.svelte";
  import SideBarItem from "../components/Sidebar/SideBarItem.svelte";
  import NavBar from "../components/NavBar/NavBar.svelte";
  import NavBarItem from "../components/NavBar/NavBarItem.svelte";
  import { CHAPTERS, NAV_BAR } from "../config";
  import { AppMode } from "../types";
  import { CapitalizeString } from "../lib/string";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";

  const mode = writable(get(session).mode);
  let view = $page.url.href.split("#")[1] || "general";

  onMount(() => {
    mode.set(Number(localStorage.getItem("mode") || AppMode.light));
    mode.subscribe((value) => {
      localStorage.setItem("mode", value + "");
      fetch("/dns/api/mode", { method: "POST", body: `${value}` });
    });
  });
</script>

<div class={AppMode[$mode]}>
  <div class="bg-gray-50 dark:bg-gray-800">
    <NavBar name="lets-dns-it">
      {#each NAV_BAR as options}
        <NavBarItem {...options} />
      {/each}
    </NavBar>

    <div class="flex flex-col sm:flex-row container mx-auto">
      <SideBar>
        <SideBarItem name="General" bind:view>
          <i class="fa-solid fa-gear mr-3" />
        </SideBarItem>

        {#each Object.keys(CHAPTERS) as key}
          <SideBarChapter name={key}>
            {#each CHAPTERS[key] as { icon, name }}
              <SideBarItem {name} bind:view>
                <i class="fa-solid {icon} mr-3" />
              </SideBarItem>
            {/each}
          </SideBarChapter>
        {/each}

        <SideBarChapter name="settings">
          <SideBarItem name="Modify Record" bind:view>
            <i class="fa-solid fa-sliders mr-3" />
          </SideBarItem>

          <SideBarItem onClick={() => mode.set(Number(!$mode))}>
            <div
              class="group-hover:text-blue-600 dark:group-hover:text-yellow-200"
            >
              <i
                class="fas {$mode == AppMode.dark
                  ? 'fa-sun'
                  : 'fa-moon'} dar mr-3"
              />
              {CapitalizeString(AppMode[Number(!$mode)])} Mode
            </div>
          </SideBarItem>
        </SideBarChapter>
      </SideBar>
      <slot />
    </div>

    <footer />
  </div>
</div>

<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;
  }
</style>
