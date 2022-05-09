<script lang="ts">
  import "../app.css";
  import SideBar from "../components/Sidebar/SideBar.svelte";
  import SideBarChapter from "../components/Sidebar/SideBarChapter.svelte";
  import SideBarItem from "../components/Sidebar/SideBarItem.svelte";

  // TODO:
  // const view = window.location.href.split("#")[1] || "";
</script>

<svelte:head>
  <script
    src="https://kit.fontawesome.com/b63ee8483a.js"
    crossorigin="anonymous"></script>
</svelte:head>

<div class="root flex flex-row w-full pr-4 mx-auto">
  <SideBar>
    <SideBarItem selected>
      <i class="fa-solid fa-gear mr-2" />
      General</SideBarItem
    >

    <SideBarChapter name="test">
      <SideBarItem selection="home">
        <i class="fa-solid fa-house mr-2" />
        Home</SideBarItem
      >

      <SideBarItem>
        <i class="fa-solid fa-user mr-3" />
        Users</SideBarItem
      >
      <SideBarItem>Colors</SideBarItem>
      <SideBarItem>Orders</SideBarItem>
      <SideBarItem>Customers</SideBarItem>
    </SideBarChapter>

    <SideBarChapter name="test">
      <SideBarItem>Home</SideBarItem>
      <SideBarItem>Dashboard</SideBarItem>
      <SideBarItem>Colors</SideBarItem>
      <SideBarItem>Orders</SideBarItem>
      <SideBarItem>Customers</SideBarItem>
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
