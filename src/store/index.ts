/* eslint-disable @typescript-eslint/camelcase */

import Vue from "vue";
import Vuex from "vuex";
import { Map, GeoJSONSource, Popup } from "mapbox-gl";
import style from "./mapstyle";
import { Entity } from "./types";
import { FeatureCollection, Feature } from "geojson";

import Pbf from "pbf";

// const buffer = require("./gtfs.proto");

// const reader = new Pbf(buffer);

function GTFSToGeoJson(entities: Entity[]): FeatureCollection {
  const fc: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };

  for (const e of entities) {
    if (e.vehicle) {
      const { latitude, longitude, bearing } = e.vehicle.position || {};
      const { route_id, trip_id, start_date } = e.vehicle.trip || {};
      const { id, label, license_plate } = e.vehicle.vehicle || {};
      // const { bear}
      const feature: Feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        properties: {
          route_id,
          trip_id,
          start_date,
          bearing,
          license_plate,
          vehicle_id: id,
          label,
          ...e.vehicle
        }
      };
      fc.features.push(feature);
    }
  }

  return fc;
}

import { FeedMessage } from "./gtfs.proto.js";

// import Pbf from "pbf";

const busPbfUri = "https://buses.jtbaker.workers.dev";

async function updateBuses() {
  const response = await fetch(busPbfUri);
  const bufferRes = await response.arrayBuffer();
  // debugger;
  const pbf = new Pbf(new Uint8Array(bufferRes));
  const obj = FeedMessage.read(pbf);
  return obj;
}
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    map: {} as Map,
    popup: {} as Popup
  },
  mutations: {
    initMap(state, { container }: { container: HTMLElement }) {
      state.map = new Map({
        container,
        style,
        hash: true
      });

      this.dispatch("setBuses");

      setInterval(async () => {
        this.dispatch("setBuses");
      }, 10000);
    }
  },
  actions: {
    async setBuses({ state }) {
      const obj = await updateBuses();
      const geojson = GTFSToGeoJson(obj.entity);
      const buses = state.map.getSource("buses") as GeoJSONSource;
      buses.setData(geojson);
    }
  },
  getters: {
    map(state) {
      return state.map;
    }
  },
  modules: {}
});
