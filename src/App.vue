<template>
  <div id="app" class="flex flex-col h-full">
    <div
      class="flex flex-column justify-center items-center bg-opacity-90 bg-blue-800 text-white text-lg font-bold h-20 shadow-xl border-b-2 border-black select-none"
    >
      <p>Cap Metro Bus Locations</p>
    </div>
    <v-map class="flex h-full outline-none"> </v-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VMap from "./components/VMap.vue";

export default Vue.extend({
  name: "App",
  components: {
    VMap,
  },
});
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
</style>
