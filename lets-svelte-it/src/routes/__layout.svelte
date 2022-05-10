<script lang="ts">
  import "../app.css";
  import SideBar from "../components/Sidebar/SideBar.svelte";
  import SideBarChapter from "../components/Sidebar/SideBarChapter.svelte";
  import SideBarItem from "../components/Sidebar/SideBarItem.svelte";
  import NavBar from "../components/NavBar/NavBar.svelte";
  import { onMount } from "svelte";
  import { CapitalizeString } from "../lib/string";
  import NavBarItem from "../components/NavBar/NavBarItem.svelte";

  const NAV_BAR = [
    { name: "/mortis-greamreaper", href: "home" },
    { name: "/grape", href: "test" },
    { name: "/void", href: "t" },
    { name: "/botodachi", href: "#" },
  ];

  const MAIN_CHAPTER = [
    { icon: "fa-solid fa-house", name: "home" },
    { icon: "fa-solid fa-user", name: "users" },
    { icon: "fa-solid fa-question", name: "colors" },
    { icon: "fa-solid fa-question", name: "orders" },
  ];

  const TEST_CHAPTER = [
    { icon: "fa-solid fa-house", name: "home test" },
    { icon: "fa-solid fa-user", name: "users test" },
    { icon: "fa-solid fa-question", name: "colors test" },
    { icon: "fa-solid fa-question", name: "orders test" },
  ];

  let view: string;
  const setView = (s: string) => (view = s);
  onMount(() => (view = window.location.href.split("#")[1] || "general"));
</script>

<svelte:head>
  <script
    src="https://kit.fontawesome.com/b63ee8483a.js"
    crossorigin="anonymous"></script>
</svelte:head>

<NavBar name="lets-dns-it">
  {#each NAV_BAR as { name, href }}
    <NavBarItem {name} {href} />
  {/each}
</NavBar>

<div class="flex flex-col sm:flex-row container mx-auto">
  <SideBar>
    <SideBarItem selection="general" selected={view === "general"} {setView}>
      <i class="fa-solid fa-gear mr-2" />
      General</SideBarItem
    >

    <SideBarChapter name="main">
      {#each MAIN_CHAPTER as { icon, name }}
        <SideBarItem
          selection={name}
          selected={view === name.replace(/ /g, "_")}
          {setView}
        >
          <i class="{icon} mr-2" />
          {CapitalizeString(name)}</SideBarItem
        >
      {/each}
    </SideBarChapter>

    <SideBarChapter name="test">
      {#each TEST_CHAPTER as { icon, name }}
        <SideBarItem
          selection={name}
          selected={view === name.replace(/ /g, "_")}
          {setView}
        >
          <i class="{icon} mr-2" />
          {CapitalizeString(name)}</SideBarItem
        >
      {/each}
    </SideBarChapter>
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
