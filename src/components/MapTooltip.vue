<template>
  <transition name="tooltip">
    <div
      v-show="hoverFeature"
      class="bg-opacity-90 bg-blue-900 text-white rounded-sm shadow-xl"
    >
      <table
        v-if="hoverFeature"
        class="border-separate p-2"
        style="border-spacing: .5em .5em .5em .5em;"
      >
        <tbody>
          <tr class="text-left" v-for="(item, key) in hoverFeature" :key="key">
            <th
              class="mr-5"
              v-if="!(typeof item === 'string' && item.slice(0, 1) === '{')"
            >
              {{ capitalize(key) }}
            </th>
            <td v-if="!(typeof item === 'string' && item.slice(0, 1) === '{')">
              <p>{{ item }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { capitalize } from "@/store/index";

interface Properties {
  [key: string]: string | number | boolean;
}

export default Vue.extend({
  props: {
    // hoverFeature: {
    //     type: Object as () => Properties,
    //     required: false
    // }
  },
  methods: {
    capitalize
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["hoverFeature"])
  }
});
</script>

<style>
.tooltip-enter {
  opacity: 0;
}

.tooltip-enter-active {
  transition: opacity 0.5s;
}

.tooltip-leave {
  opacity: 0.5;
}
.tooltip-leave-active {
  transition: opacity 0.5s;
}
</style>
