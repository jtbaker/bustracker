<template>
  <div
    class="flex w-64 flex-col overflow-hidden bg-white bg-opacity-80 rounded shadow-md border-black"
  >
    <span>Location Search</span>
    <input
      type="text"
      class="font-bold p-1 outline-none bg-gray-400"
      v-model="inp"
    />
    <hr />

    <div
      v-for="opt in options"
      :key="opt.properties.place_id"
      :value="opt"
      class="hover:bg-gray-400"
      @click="sel = opt"
    >
      <span class="flex-wrap overflow-hidden">
        {{ opt.properties.display_name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Feature } from "@/store/types";
import { mapGetters } from "vuex";
import { Map, Marker, LngLat } from "mapbox-gl";
import { easeToBeartingTransform } from "@/store/index";

async function GetOSMData(q: string) {
  const bboxQuery = `&viewbox=${encodeURIComponent(
    "-98.0,29.0,-96.0,31.0"
  )}&bounded=1`;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?q=${q}${bboxQuery}&polygon_geojson=0&format=geojson`
  ).then(r => r.json());
  return response;
}

export default Vue.extend({
  data: () => ({
    input: null as string,
    options: [] as Feature[],
    selection: null as Feature,
    timeout: null
  }),
  computed: {
    sel: {
      get(): Feature | null {
        return this.selection;
      },
      set(value: Feature): void {
        this.selection = value;
        this.input = value.properties.display_name;
        const [lng, lat] = value.geometry.coordinates;
        const longLat = new LngLat(lng, lat);
        (this.marker as Marker).setLngLat(longLat).addTo(this.map as Map);
        easeToBeartingTransform(this.map, longLat);
      }
    },
    inp: {
      get(): string {
        return this.input;
      },
      async set(value: string): Promise<void> {
        this.input = value;
        this.options = [];
        this.marker.remove();
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          const response = await GetOSMData(value);
          this.options = response.features;
          (this.map as Map).resize();
        }, 200);
      }
    },
    ...mapGetters(["map", "marker"])
  }
});
</script>

<style></style>
