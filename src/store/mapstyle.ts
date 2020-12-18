import { Style } from "mapbox-gl";

const style: Style = {
  version: 8,
  center: [-97.75, 30.25],
  pitch: 60,
  bearing: 20,
  zoom: 12,
  sprite: "http://localhost:8080/sprite",
  glyphs: "http://localhost:8080/glyphs/{fontstack}/{range}.pbf",
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      ],
      tileSize: 200
    },
    buses: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    }
  },
  layers: [
    {
      id: "carto",
      source: "carto",
      type: "raster"
    },
    {
      id: "buses",
      source: "buses",
      type: "symbol",
      paint: {
        "icon-color": "blue"
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
          0.003,
          15,
          0.08,
          20,
          0.15
        ],
        "icon-rotation-alignment": "map",
        "icon-rotate": ["-", ["get", "bearing"], 90],
        "icon-allow-overlap": true,
        "text-field": ["get", "route_id"],
        "text-font": ["Open Sans Bold"]
      }
    }
  ]
};

export default style;