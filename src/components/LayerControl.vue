<template>
  <div
    class="bg-blue-100 z-50 bg-opacity-90 border border-black shadow-md border-opacity-50 rounded-sm p-2"
  >
    <div>
      <h2 class="text-md font-bold">Layer Control</h2>
      <hr />
    </div>
    <div id="basemaps" class="border-b border-black">
      <h3 class="text-md">Basemap</h3>
      <div
        v-for="layer in layers.basemaps"
        :key="layer.layer_label"
        class="p-1"
      >
        <label class="space-x-2 flex items-center">
          <input
            type="radio"
            name="basemaps"
            :checked="layer.visible"
            @change="
              ({ target }) => {
                layer.layer_ids.forEach(v => {
                  toggleLayer(v, target.checked);
                });
                layers.basemaps
                  .filter(v => v.layer_label != layer.layer_label)
                  .forEach(v => {
                    v.layer_ids.forEach(key => {
                      toggleLayer(key, !target.checked);
                    });
                  });
              }
            "
          />
          <span
            class="select-none hover:border-opacity-50 hover:border hover:shadow-sm cursor-pointer"
            >{{ layer.layer_label }}</span
          >
        </label>
      </div>
    </div>
    <hr v-if="layers.overlays.length" />
    <div id="overlays">
      <div
        v-for="layer in layers.overlays"
        :key="layer.layer_label"
        class="p-1"
      >
        <label class="space-x-2 flex items-center"
          ><input
            type="checkbox"
            @change="
              ({ target }) => {
                layer.layer_ids.forEach(k => {
                  toggleLayer(k, target.checked);
                });
              }
            "
            v-model="layer.visible"
          />
          <span
            class="select-none hover:border-opacity-50 hover:border hover:border-black hover:shadow-sm cursor-pointer"
            >{{ layer.layer_label }}</span
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
// import { Layer } from "../store/types";

export default Vue.extend({
  methods: {
    toggleLayer(layerId: string, visible: boolean) {
      this.map.setLayoutProperty(
        layerId,
        "visibility",
        visible ? "visible" : "none"
      );
    }
  },
  computed: {
    ...mapGetters(["map", "popup", "layers"])
  }
});
</script>

<style></style>
