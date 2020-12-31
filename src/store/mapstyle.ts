import { Style } from "mapbox-gl";

const style: Style = {
  version: 8,
  center: [-97.75, 30.25],
  pitch: 60,
  bearing: 20,
  zoom: 12,
  sprite: `${window.location.origin}/sprite`,
  glyphs: `${window.location.origin}/glyphs/{fontstack}/{range}.pbf`,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      ],
      tileSize: 200,
      attribution: "Carto Maps"
    },
    google: {
      type: "raster",
      tileSize: 200,
      tiles: ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"]
    },
    buses: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      },
      attribution: "Capital Metro"
    },
    routes: {
      type: "geojson",
      data: `${window.location.origin}/routes.geojson`
    },
    stops: {
      type: "geojson",
      data: `${window.location.origin}/stops.geojson`
    }
  },
  layers: [
    {
      id: "carto",
      source: "carto",
      type: "raster"
    },
    {
      id: "google",
      source: "google",
      type: "raster",
      layout: {
        visibility: "none"
      }
    },
    {
      id: "routes",
      type: "line",
      source: "routes",
      paint: {
        "line-color": ["concat", "#", ["get", "ROUTECOLOR"]],
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          ["case", ["boolean", ["feature-state", "hover"], false], 3, 2],
          20,
          ["case", ["boolean", ["feature-state", "hover"], false], 12, 6]
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.9,
          0.1
        ]
      },
      layout: {
        "line-join": "round",
        "line-cap": "butt"
      }
    },
    {
      id: "route-labels",
      type: "symbol",
      source: "routes",
      paint: {
        "text-color": ["concat", "#", ["get", "TEXTCOLOR"]],
        "text-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.5
        ],
        "icon-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.5
        ]

        // "text-color": "white"
      },
      layout: {
        "text-field": ["get", "ROUTENAME"],
        "icon-optional": true,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          2,
          15,
          10,
          22,
          30
        ],
        "text-font": ["Open Sans Bold"],
        "icon-rotation-alignment": "map",
        "icon-ignore-placement": true,
        "symbol-placement": "line"
      }
    },
    {
      id: "stops",
      source: "stops",
      type: "circle",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 1, 20, 8],
        "circle-color": "green",
        "circle-stroke-color": "green",
        "circle-opacity": 0.8
      },
      layout: {}
    },
    {
      id: "buses",
      source: "buses",
      type: "symbol",
      paint: {
        "icon-color": "red",
        "text-color": "black",
        "icon-opacity": 0.9
        //   ico
        // "circle-color": "blue",
        // "circle-radius": 5,
        // "circle-opacity": 0.4
      },
      layout: {
        "icon-image": "bus",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7,
          0.001,
          15,
          0.03,
          20,
          0.15
        ],
        // "icon-optional": true,
        "icon-rotation-alignment": "map",
        "icon-rotate": ["-", ["get", "bearing"], 90],
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
        "text-field": ["get", "label"],
        "text-font": ["Open Sans Bold"],
        "text-rotation-alignment": "map",
        "text-rotate": ["-", ["get", "bearing"], 90],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          0.5,
          15,
          6,
          22,
          18
        ]
      }
    }
  ]
};

export default style;
