import leaflet from 'leaflet';
import cameraIcon from '@/assets/cam-icon.png';

export const camIcon = leaflet.icon({
  iconUrl: cameraIcon,

  iconSize: [36, 36],
  iconAnchor: [18, 18],
});
