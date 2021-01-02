<template>
  <div ref="mymap">
    <div class="fixed space-y-2 z-50 my-2 ml-2">
      <layer-control />
      <geocoder />
      <map-tooltip />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Map } from "mapbox-gl";
import LayerControl from "./LayerControl.vue";
import Geocoder from "./Geocoder.vue";
import MapTooltip from "./MapTooltip.vue";
// import { Pbf } from "../../node_modules/pbf/index"

export default Vue.extend({
  // data: () => ({ m: {} as Map }),
  mounted() {
    this.$store.commit("initMap", { container: this.$refs.mymap });
  },
  computed: {
    ...mapGetters(["map", "layers"])
  },
  components: {
    LayerControl,
    Geocoder,
    MapTooltip
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
