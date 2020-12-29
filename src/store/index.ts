/* eslint-disable @typescript-eslint/camelcase */

import Vue from "vue";
import Vuex from "vuex";
import {
  Map,
  GeoJSONSource,
  Popup,
  ScaleControl,
  GeolocateControl,
  NavigationControl,
  FullscreenControl,
} from "mapbox-gl";
import style from "./mapstyle";
import { Entity, LayerGroup, Layer } from "./types";
import { FeatureCollection, Feature } from "geojson";

import Pbf from "pbf";

function capitalize(word: string): string {
  const words = word
    .split("_")
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1));
  return words.join(" ");
}

function setHoverFeatureListener(layerId: string, source: string, map: Map) {
  let hoverFeatureId: number = null
  map.on("mousemove", layerId, e=> {
    const { features } = e
    const feature = features.length ? features[0] : {id: null}
    const { id } = feature
    if(id) {
      map.setFeatureState(
        {source, id }, {hover: true}
      )
    } else {
      map.setFeatureState({source, id: hoverFeatureId}, {hover: false})
    }
    hoverFeatureId = id

  })

  map.on("mouseout", layerId, e=> {
    if(hoverFeatureId) {
      debugger
      map.setFeatureState(
        {source, id: hoverFeatureId}, {hover: false}
      )
    }
  })
}

function JSONToTable(object: Record<string, any>): string {
  const t = `
  <table>
    <tbody>
    ${Object.keys(object)
      .map((k) => {
        const value = object[k];
        return typeof object[k] !== "string"
          ? ""
          : `
      <tr>
        <th>${capitalize(k)}</th><td>${value}</td>
      </tr>`;
      })
      .join("")}
    </tbody>
  </table>
  `;
  // const t = document.createElement("table");
  // const body = document.createElement("tbody");
  // for (const key in object) {
  //   if (!(typeof object[key] == "string" && object[key].slice(0, 2) == `{"`)) {
  //     const row = document.createElement("tr");
  //     const label = document.createElement("th");

  //     label.style["text-align"] = "left";
  //     const val = document.createElement("td");
  //     val.style["text-align"] = "left";
  //     label.innerText = capitalize(key);
  //     val.innerText = object[key];
  //     row.appendChild(label);
  //     row.appendChild(val);
  //     body.appendChild(row);
  //   }
  // }
  // t.appendChild(body);
  return t;
}

// const buffer = require("./gtfs.proto");

// const reader = new Pbf(buffer);

const ROUTE_TYPES = [
  "Local",
  "High Frequency",
  "UT Shuttle",
  "Crosstown",
  "Rail",
  "E-Bus",
  "Feeder",
  "Special",
  "Express",
  null,
  "Night Owl",
  "Flyer",
];

function GTFSToGeoJson(entities: Entity[]): FeatureCollection {
  const fc: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
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
          coordinates: [longitude, latitude],
        },
        properties: {
          route_id,
          trip_id,
          start_date,
          bearing,
          license_plate,
          vehicle_id: id,
          label,
          ...e.vehicle,
        },
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
  const pbf = new Pbf(new Uint8Array(bufferRes));
  const obj = FeedMessage.read(pbf);
  return obj;
}

Vue.use(Vuex);

const layers: LayerGroup = {
  basemaps: [
    { layer_id: "carto", layer_label: "Carto", visible: true },
    { layer_id: "google", layer_label: "Google", visible: false },
  ],
  overlays: [
    { layer_id: "buses", layer_label: "Buses", visible: true },
    {
      layer_id: "routes",
      layer_label: "Routes",
      visible: true,
      sublayers: ROUTE_TYPES.map(v=>({key: v, label: v})),
    },
  ],
};

export default new Vuex.Store({
  state: {
    map: {} as Map,
    popup: new Popup({ className: "tooltip", offset: [0, -20] }),
    layers,
  },
  mutations: {
    initMap(state, { container }: { container: HTMLElement }) {
      state.map = new Map({
        container,
        style,
        hash: true,
        boxZoom: true,
      });

      setHoverFeatureListener("routes", "routes", state.map)

      this.dispatch("setBuses");

      state.popup.addTo(state.map);

      state.map.addControl(
        new NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        "bottom-right"
      );
      state.map.addControl(new GeolocateControl(), "bottom-right");
      state.map.addControl(new ScaleControl(), "bottom-left");
      state.map.addControl(new FullscreenControl(), "top-right");

      state.map.on("mousemove", "buses", (e) => {
        state.popup.addTo(state.map).setLngLat(e.lngLat);
        const { properties } = e.features[0];

        state.popup.setHTML(JSONToTable(properties));
      });

      state.map.on("mouseout", "buses", () => {
        state.popup.remove();
      });

      setInterval(async () => {
        this.dispatch("setBuses");
      }, 10000);
    },
    toggleLayer(
      state,
      {
        layer,
        group,
        visible,
      }: { layer: Layer; group: LayerGroup; visible: boolean }
    ) {
      state.map.setLayoutProperty(
        layer.layer_id,
        "visibility",
        visible ? "visible" : "none"
      );
    },
  },
  actions: {
    async setBuses({ state }) {
      const obj = await updateBuses();
      const geojson = GTFSToGeoJson(obj.entity);
      const buses = state.map.getSource("buses") as GeoJSONSource;
      buses.setData(geojson);
    },
  },
  getters: {
    map(state) {
      return state.map;
    },
    layers(state) {
      return state.layers;
    },
  },
  modules: {},
});
