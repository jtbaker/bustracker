<template>
  <div ref="mymap">
    <layer-control/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Map } from "mapbox-gl";
import LayerControl from "./LayerControl.vue";
// import { Pbf } from "../../node_modules/pbf/index"

export default Vue.extend({
  data: () => ({ m: {} as Map }),
  mounted() {
    this.$store.commit("initMap", { container: this.$refs.mymap });
    // this.m = new Map({
    //   container: this.$refs.mymap as HTMLElement,
    //   style
    // });

    // this.$emit("mapload", this.m);
  },
  computed: {
    ...mapGetters(["map", "layers"])
  },
  components: {
    LayerControl
  }
});
</script>
<style lang="scss">
.mapboxgl-canvas {
  outline: none;
}
// @import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
// @import "../node_modules/"
</style>
