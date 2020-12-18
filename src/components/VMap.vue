<template>
  <div ref="mymap"></div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
// import { Map, Style } from "mapbox-gl";

// import { Pbf } from "../../node_modules/pbf/index"


interface Entity {
    alert: string;
    id: string;
    is_deleted: boolean;
    trip_update: 
}

export default Vue.extend({
  data: () => ({ m: {} as Map<any, any> }),
  mounted() {
    this.$store.commit("initMap", { container: this.$refs.mymap });
    // this.m = new Map({
    //   container: this.$refs.mymap as HTMLElement,
    //   style
    // });

    // this.$emit("mapload", this.m);
  },
  computed: {
    ...mapGetters(["map"])
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
