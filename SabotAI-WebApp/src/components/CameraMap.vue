<template>
  <div id="map" class="z-10"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

import leaflet from 'leaflet';
import RasterCoords from 'leaflet-rastercoords';

import { camIcon } from '@/config/icon.config';

const emit = defineEmits(['click:marker']);
const props = defineProps({
  cameras: {
    type: Array,
    required: true,
  },
});

const cameraMap = ref();
const mapReady = ref(false);
const rasterCoords = ref();
const baseImage = ref();

const createMap = () => {
  const locations = [
    { x: 4008, y: 1124, name: 'Cafeteria' },
    { x: 4008, y: 2080, name: 'Suranimala Building' },
    { x: 4090, y: 3264, name: 'Faculty of Engineering' },
    { x: 3856, y: 5192, name: 'Temple premises' },
    { x: 752, y: 5656, name: 'Tennis Court' },
  ];
  const img = [8192, 8192];

  const map = leaflet.map('map', {
    crs: leaflet.CRS.Simple,
    zoomControl: false,
    attributionControl: true,
  });

  const rc = new RasterCoords(map, img);

  // fix issue with zoom level
  map.setMaxZoom(rc.zoomLevel() - 1);
  map.setView(rc.unproject([img[0], img[1]]), 2);

  leaflet
    .tileLayer(
      // TODO: upload webp version
      'https://firebasestorage.googleapis.com/v0/b/fyp-ai-d10fe.appspot.com/o/engineering%2F{z}%2F{x}%2F{y}.webp?alt=media',
      {
        noWrap: true,
        bounds: rc.getMaxBounds(),
        maxNativeZoom: rc.zoomLevel(),
        attribution: 'Copyright © 2023 - SabotAI',
      },
    )
    .addTo(map);

  cameraMap.value = map;
  rasterCoords.value = rc;
  baseImage.value = img;

  mapReady.value = true;

  // uncomment this to place markers
  // map.on('click', function (e) {
  //   const coords = rc.project(e.latlng);
  //   const marker = leaflet.marker(rc.unproject(coords)).addTo(map);
  //   marker.bindPopup('[' + Math.floor(coords.x) + ',' + Math.floor(coords.y) + ']').openPopup();
  // });

  locations.forEach((location) => {
    const { x, y } = location;
    leaflet
      .marker(rc.unproject({ x, y }), {
        icon: leaflet.divIcon({
          iconSize: null,
          className: 'label',
          html: '<div>' + location.name + '</div>',
        }),
      })
      .addTo(map);
  });

  // remove default attribution
  map.attributionControl.setPrefix(false);
};

const disposeMap = () => {
  if (cameraMap.value) {
    cameraMap.value.off();
    cameraMap.value.remove();
  }
};

const setMarkers = () => {
  props.cameras.forEach((cam) => {
    const { markerConfig, ...camera } = cam;
    // TODO: override color

    const coords = rasterCoords.value.unproject(camera.coords);

    const marker = leaflet
      .marker(coords, { icon: camIcon, camera })
      .addTo(cameraMap.value)
      .on('click', onMarkerClick);

    // TODO: toggle
    marker.bindTooltip(camera.name, {
      permanent: true,
      direction: 'bottom',
      className: 'transparent-tooltip',
      offset: [0, 8],
    });
  });
};

function onMarkerClick(e) {
  emit('click:marker', this.options);
}

onMounted(createMap);
onBeforeUnmount(disposeMap);

watch([mapReady, () => props.cameras], ([mapReadyState]) => {
  if (mapReadyState) {
    setMarkers();
  }
});
</script>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: white;
}

.transparent-tooltip {
  background: transparent;
  border: none;
  box-shadow: none;
  color: blue;
  font-family: inherit;
  font-weight: bold;
}

.transparent-tooltip::before {
  border: none;
}

.label {
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  margin-top: -1em;
}

.label div {
  position: relative;
  left: -50%;
  top: 10px;
  text-shadow: 0px 2px 1px rgba(255, 255, 255, 0.85);
}
</style>
