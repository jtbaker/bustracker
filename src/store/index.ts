/* eslint-disable @typescript-eslint/camelcase */

import Vue from "vue";
import Vuex from "vuex";
import {
  Map,
  GeoJSONSource,
  Popup,
  Marker,
  ScaleControl,
  GeolocateControl,
  NavigationControl,
  FullscreenControl,
  LngLat
} from "mapbox-gl";
import style from "./mapstyle";
import { Entity, LayerGroup, Layer } from "./types";
import { FeatureCollection, Feature } from "geojson";

import Pbf from "pbf";

export function capitalize(word: string): string {
  const words = word
    .split("_")
    .map(v => v.charAt(0).toUpperCase() + v.slice(1,).toLowerCase());
  return words.join(" ");
}

function bearing(p1: LngLat, p2: LngLat): number {
  const { lng: x1, lat: y1 } = p1;
  const { lng: x2, lat: y2 } = p2;
  const degrees = Math.atan2(x2 - x1, y2 - y1) * (180 / Math.PI);
  return (degrees + 360) % 360;
}

export function easeToBeartingTransform(map: Map, to: LngLat) {
  const p1 = map.getCenter();
  const targetBearing = (bearing(p1, to) + 180) % 360;
  const zoom = Math.random() + 8 * (Math.random() + 1);
  map.easeTo({
    center: to,
    bearing: targetBearing,
    pitch: 45,
    zoom,
    duration: 1000
  });
}

function setHoverFeatureListener(layerId: string, source: string, map: Map) {
  let hoverFeatureIds: number[] = [];
  map.on("mousemove", layerId, async e => {
    const { features } = e;
    const ids = features.map(v => v.id);
    // const feature = features.length ? features[0] : { id: null };
    // const { id } = feature;
    // hoverFeatureIds.
    for (const id of ids) {
      hoverFeatureIds.push(id as number);
    }
    // hoverFeatureIds.push(id)
    for (const v of hoverFeatureIds) {
      map.setFeatureState(
        { source, id: v },
        { hover: ids.includes(v) && v ? true : false }
      );
    }
    hoverFeatureIds = hoverFeatureIds.filter(v => ids.includes(v) && v);
    // else {
    //   hoverFeatureIds.forEach(v=> {
    //     map.setFeatureState({source: id: v}, {hover: false})
    //   })
    //   map.setFeatureState({ source, id: hoverFeatureId }, { hover: false });
    //   hoverFeatureId = id
    // }
  });

  map.on("mouseleave", layerId, () => {
    hoverFeatureIds.forEach(v => {
      map.setFeatureState({ source, id: v }, { hover: false });
    });
    hoverFeatureIds = [];
  });
}

function JSONToTable(object: Record<string, any>): string {
  const t = `
  <table>
    <tbody>
    ${Object.keys(object)
      .map(k => {
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
  "Flyer"
];

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
  const pbf = new Pbf(new Uint8Array(bufferRes));
  const obj = FeedMessage.read(pbf);
  return obj;
}

Vue.use(Vuex);

const layers: LayerGroup = {
  basemaps: [
    { layer_ids: ["carto"], layer_label: "Carto", visible: true },
    { layer_ids: ["google"], layer_label: "Google", visible: false }
  ],
  overlays: [
    { layer_ids: ["buses"], layer_label: "Buses", visible: true },
    {
      layer_ids: ["routes", "route-labels"],
      layer_label: "Routes",
      visible: true,
      sublayers: ROUTE_TYPES.map(v => ({ key: v, label: v }))
    },
    {
      layer_ids: ["stops"],
      layer_label: "Stops",
      visible: true
    }
  ]
};

interface Properties {
  [key: string]: string | number | boolean | null;
}

export default new Vuex.Store({
  state: {
    map: {} as Map,
    marker: new Marker({ color: "orange" }),
    hoverFeature: null as Properties | null,
    hoverLayer: null as string | null,
    layers
  },
  mutations: {
    initMap(state, { container }: { container: HTMLElement }) {
      state.map = new Map({
        container,
        style,
        hash: true,
        boxZoom: true
      });

      setHoverFeatureListener("routes", "routes", state.map);

      this.dispatch("setBuses");


      state.map.addControl(
        new NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }),
        "bottom-right"
      );
      state.map.addControl(new GeolocateControl(), "bottom-right");
      state.map.addControl(new ScaleControl(), "bottom-left");
      state.map.addControl(new FullscreenControl(), "top-right");

      state.map.on("mousemove", e => {
        const features = state.map.queryRenderedFeatures(e.point)
        const { properties, layer } = features.length ? features[0] : {properties: null, layer: null};
        const { style } = state.map.getCanvas()
        style.cursor = layer ? "pointer" : ""
        this.commit("setHoverFeature", properties)
        this.commit("setHoverLayer", layer ? layer.id : null)
      });



      setInterval(async () => {
        this.dispatch("setBuses");
      }, 10000);
    },
    setHoverFeature(state, payload: Properties | null): void {
      state.hoverFeature = payload;
    },
    setHoverLayer(state, layer: string | null) {
      state.hoverLayer = layer
    },
    toggleLayer(
      state,
      {
        layer_id,
        group,
        visible
      }: { layer_id: string; group: LayerGroup; visible: boolean }
    ) {
      state.map.setLayoutProperty(
        layer_id,
        "visibility",
        visible ? "visible" : "none"
      );
      const n = group;
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
    },
    layers(state) {
      return state.layers;
    },
    marker(state) {
      return state.marker;
    },
    hoverFeature(state) {
      return state.hoverFeature
    },
    hoverLayer(state) {
      return state.hoverLayer
    }
  },
  modules: {}
});
