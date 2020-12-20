<template>
  <div
    class="flex flex-col bg-blue-100 z-50 bg-opacity-90 fixed mt-2 ml-2 border border-black shadow-md border-opacity-50 rounded-sm p-2"
  >
    <div>
      <h2 class="text-md font-bold">Layer Control</h2>
      <hr class="border-b border-black" />
    </div>
    <div id="basemaps" class="border-b border-black">
      <h3 class="text-md">Basemap</h3>
      <div v-for="layer in basemaps" :key="layer.layer_id" class="p-1">
        <label class="space-x-2 flex items-center">
          <input
            type="radio"
            :name="basemaps"
            @change="
              ({ target }) => {
                toggleLayer(layer.layer_id, target.checked);
                basemaps
                  .filter(v => v.layer_id != layer.layer_id)
                  .forEach(v => toggleLayer(v.layer_id, !target.checked));
              }
            "
          />
          <span
            class="select-none hover:border-opacity-50 hover:border hover:shadow-sm cursor-pointer"
            >{{ layer.layer_name }}</span
          >
        </label>
      </div>
    </div>
    <hr v-if="overlays.length" />
    <div id="overlays">
      <div v-for="layer in overlays" :key="layer.layer_id" class="p-1">
        <label class="space-x-2 flex items-center"
          ><input
            type="checkbox"
            @change="
              ({ target }) => toggleLayer(layer.layer_id, target.checked)
            "
          />
          <span
            class="select-none hover:border-opacity-50 hover:border hover:border-black hover:shadow-sm cursor-pointer"
            >{{ layer.layer_name }}</span
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Layer } from "../store/types";

export default Vue.extend({
  props: {
    basemaps: {
      type: Array as () => Layer[]
    },
    overlays: {
      type: Array as () => Layer[]
    }
  },
  methods: {
    toggleLayer(layerId: string, visible: boolean) {
      debugger;
      this.map.setLayoutProperty(
        layerId,
        "visibility",
        visible ? "visible" : "none"
      );
    }
  },
  computed: {
    ...mapGetters(["map", "popup"])
  }
});
</script>

<style></style>
