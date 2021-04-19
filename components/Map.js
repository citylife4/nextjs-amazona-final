import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({ iconUrl: '/images/leaflet/marker-icon.png' });

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      console.log('click');
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);

      map.flyTo(e.latlng, map.getZoom());
    },
  });
  useEffect(() => {
    setTimeout(() => {
      if (!position) {
        setPosition({ lat: 51.505, lng: -0.09 });
      }
    }, 2000);
  }, []);

  return position === null ? null : (
    <Marker icon={icon} position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

const Map = () => {
  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
