'use client';

import { useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapWithMarkerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const DraggableMarker = ({ onLocationChange }: MapWithMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);

  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng(newPos);
      }
      onLocationChange(newPos.lat, newPos.lng);
      map.flyTo(newPos, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onLocationChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[-6.792354, 39.208328]} // Default to Dar es Salaam
      ref={markerRef}
    />
  );
};

export default function MapWithMarker({ onLocationChange }: MapWithMarkerProps) {
  const mapInstanceRef = useRef<{ target: L.Map } | null>(null);

  // Cleanup effect to destroy the map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current && mapInstanceRef.current.target) {
        mapInstanceRef.current.target.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[-6.792354, 39.208328]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        whenReady={(map) => { mapInstanceRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}
