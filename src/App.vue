<script setup>
import { ref, reactive, watchEffect } from "vue";
// Pinia
import { storeToRefs } from "pinia";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { useFeature } from "@/stores/featureStore";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const runtimeStore = useRuntimeStore();
const { markers } = storeToRefs(useFeature());
const { addMarker } = useFeature();
const loadMap = ref(false);

const state = reactive({
  map: {
    container: "map", // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [-82.38556, 34.84444], // starting position [lng, lat]
    zoom: 12, // starting zoom
    projection: "globe", // display the map as a 3D globe,

    maxPitch: 80,
  },
  globeMap: {
    container: "map",
    projection: "globe",
  },
});

watchEffect(() => {
  if (runtimeStore.$state.mapboxToken) {
    mapboxgl.accessToken = runtimeStore.$state.mapboxToken;
    loadMap.value = true;
  }
  if (loadMap.value) {
    const map = new mapboxgl.Map(state.map);
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    markers.value.forEach((marker) => {
      new mapboxgl.Marker().setLngLat(marker).addTo(map);
    });
    map.on("load", () => {
      map.setFog({
        "horizon-blend": 0.3,
        color: "#f8f0e3",
        "high-color": "#add8e6",
        "space-color": "#d8f2ff",
        "star-intensity": 0.0,
      });
    });
    map.on("click", (e) => {
      // new mapboxgl.Marker().setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
      state.map.center = [e.lngLat.lng, e.lngLat.lat];
      addMarker([e.lngLat.lng, e.lngLat.lat]);
      // map.flyTo({
      //   center: [e.lngLat.lng, e.lngLat.lat],
      // });
    });
    map.on("error", () => {
      window.location.reload();
    });
  }
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
