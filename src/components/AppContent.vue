<template>
  <div id="app-content">
    <router-view />
  </div>
</template>

<script>

export default {
  name: "AppContent",
};
</script>

<style>
#app-content {
  flex: 1;
  height: 100%;
}
</style>