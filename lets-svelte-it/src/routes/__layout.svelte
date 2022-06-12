<script lang="ts">
  import "../app.css";
  import SideBar from "../components/Sidebar/SideBar.svelte";
  import SideBarChapter from "../components/Sidebar/SideBarChapter.svelte";
  import SideBarItem from "../components/Sidebar/SideBarItem.svelte";
  import NavBar from "../components/NavBar/NavBar.svelte";
  import { onMount } from "svelte";
  import { CapitalizeString } from "../lib/string";
  import NavBarItem from "../components/NavBar/NavBarItem.svelte";
  import { CHAPTERS, NAV_BAR } from "../constant";

  let view: string;
  const setView = (s: string) => (view = s);
  onMount(() => (view = window.location.href.split("#")[1] || "general"));
</script>

<NavBar name="lets-dns-it">
  {#each NAV_BAR as options}
    <NavBarItem {...options} />
  {/each}
</NavBar>

<div class="flex flex-col sm:flex-row container mx-auto">
  <SideBar>
    <SideBarItem section="general" selected={view === "general"} {setView}>
      <i class="fa-solid fa-gear mr-2" />
      General</SideBarItem
    >

    {#each Object.keys(CHAPTERS) as key}
      <SideBarChapter name={key}>
        {#each CHAPTERS[key] as { on, off, name }}
          {#if view === name.replace(/ /g, "_").toLowerCase()}
            <SideBarItem section={name} selected {setView}>
              <i class="fa-solid {on} mr-2" />
              {CapitalizeString(name)}</SideBarItem
            >
          {:else}
            <SideBarItem section={name} {setView}>
              <i class="fa-solid {off || on} mr-2" />
              {CapitalizeString(name)}</SideBarItem
            >
          {/if}
        {/each}
      </SideBarChapter>
    {/each}
  </SideBar>
  <slot />
</div>

<footer />

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
