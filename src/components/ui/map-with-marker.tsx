'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LatLng, Icon } from 'leaflet';
import 'leaflet-defaulticon-compatibility';


interface MapWithMarkerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const DraggableMarker = ({ onLocationChange }: MapWithMarkerProps) => {
  const [position, setPosition] = useState<LatLngExpression>([-6.792354, 39.208328]);
  const markerRef = useRef<any>(null);

   useEffect(() => {
    // Set initial location
    onLocationChange(-6.792354, 39.208328);
  }, []);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
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
      position={position}
      ref={markerRef}
    />
  );
};


export default function MapWithMarker({ onLocationChange }: MapWithMarkerProps) {
    return (
        <MapContainer
            center={[-6.792354, 39.208328]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker onLocationChange={onLocationChange} />
        </MapContainer>
    );
}
    