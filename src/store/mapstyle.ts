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
        "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
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
