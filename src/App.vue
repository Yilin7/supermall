<template>
  <div id="app" class="wrapper">
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>

    <main-tab-bar />
    <icon></icon>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
  import MainTabBar from "./components/content/mainTabbar/MainTabBar.vue";
  import Icon from 'components/content/Icon/Icon.vue'
  import SvgIcon from 'components/content/Icon/svg.vue'
  export default {
    name: "App",
    components: {
      MainTabBar,
      Icon,
      SvgIcon
    },
  };
</script>

<style>
@import "assets/css/base.css";
</style>
