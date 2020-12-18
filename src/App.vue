<template>
  <div id="app" class="flex flex-col h-full">
    <div
      class="flex flex-column justify-center items-center bg-opacity-90 bg-blue-600 text-white text-lg font-bold h-40 shadow-xl border-b-2 border-black border-opacity-20"
    >
    <p>App Title</p>
    </div>
    <v-map class="flex h-full outline-none"> </v-map>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VMap from "./components/VMap.vue";
// import HelloWorld from "./components/HelloWorld.vue";

export default Vue.extend({
  name: "App",
  components: {
    // HelloWorld,
    VMap
  }
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
