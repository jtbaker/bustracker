/* eslint-disable @typescript-eslint/camelcase */

import Vue from "vue";
import Vuex from "vuex";
import { Map, GeoJSONSource, Popup } from "mapbox-gl";
import style from "./mapstyle";
import { Entity } from "./types";
import { FeatureCollection, Feature } from "geojson";

import Pbf from "pbf";

function JSONToTable(object: Record<string, any>): HTMLTableElement {
  const t = document.createElement("table")
  const body = document.createElement("tbody")
  for(const key in object) {
    debugger
    if(!(typeof object[key]=="string" && object[key].slice(0,2)==`{"`)){
      const row = document.createElement("tr")
      const label = document.createElement("th")
    
      label.style["text-align"]= "left"
      const val = document.createElement("td")
      val.style["text-align"] = "left"
      label.innerText = key
      val.innerText = object[key]
      row.appendChild(label)
      row.appendChild(val)
      body.appendChild(row)
    }
  }
  t.appendChild(body)
  return t
}

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
    popup: new Popup()
  },
  mutations: {
    initMap(state, { container }: { container: HTMLElement }) {
      state.map = new Map({
        container,
        style,
        hash: true
      });

      this.dispatch("setBuses");

      state.popup.addTo(state.map)

      state.map.on("mousemove", "buses", e=> {
        debugger
        state.popup.addTo(state.map).setLngLat(e.lngLat)
        const { properties } = e.features[0]
        state.popup.setDOMContent(JSONToTable(properties))
      })

      state.map.on("mouseout", "buses", e => {
        state.popup.remove()
      })

      setInterval(async () => {
        this.dispatch("setBuses");
      }, 10000);
    },
    // initPopup(state) {
    //   state.popup = new Popup()
    //   state.popup.addTo(state.map)
    //   debugger
    // }
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
