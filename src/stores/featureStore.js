import { defineStore } from "pinia";
import mapboxgl from "mapbox-gl";

export const useFeature = defineStore({
  id: "featureStore",
  state: () => ({
    markers: [],
  }),
  actions: {
    addMarker(coords) {
      this.markers = [...this.markers, coords];
    },
  },
});
