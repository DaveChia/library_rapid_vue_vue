<template>
  <div id="app-content">
    <router-view />
    <!-- <MainDashboard /> -->
  </div>
</template>

<script>
// import MainDashboard from "./MainDashboard.vue";

export default {
  name: "AppContent",
  //   components: {
  //     MainDashboard,
  //   },
};
</script>



<style>
#app-content {
  flex: 1;
  height: 100%;
}
</style>