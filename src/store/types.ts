export interface Entity {
  id: string;
  is_deleted: boolean;
  trip_update: null;
  vehicle: Vehicle;
  alert: null;
}

export interface Trip {
  direction_id: number;
  route_id: string;
  schedule_relationship: string;
  start_date: string;
  start_time: string;
  trip_id: string;
}

export interface Vehicle {
  trip: Trip;
  vehicle: VehicleDetail;
  position: Position;
  current_stop_sequence: number;
  stop_id: string;
  current_status: CurrentStatus;
  timestamp: number;
  congestion_level: number;
  occupancy_status: number;
}

export interface CurrentStatus {
  value: number;
  options: Options;
}

export interface Options {
  [key: string]: string | Record<string, string>;
}

export interface Position {
  latitude: number;
  longitude: number;
  bearing: number;
  odometer: number;
  speed: number;
}

export interface VehicleDetail {
  id: string;
  label: string;
  license_plate: string;
}

export interface Layer {
  layer_ids: string[];
  layer_label: string;
  visible: boolean;
  sublayers?: SubLayer[];
}

export interface SubLayer {
  key: string;
  label: string;
}

export interface LayerGroup {
  basemaps: Layer[];
  overlays: Layer[];
}

export interface Feature {
  type: string;
  properties: Properties;
  bbox: number[];
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  place_id: number;
  osm_type: string;
  osm_id: number;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
}
