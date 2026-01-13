'use client';

import { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LatLng, Map } from 'leaflet';
import { Skeleton } from './skeleton';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const DraggableMarker = ({ onLocationChange }: LocationPickerProps) => {
  const [position, setPosition] = useState<LatLngExpression>([-6.792354, 39.208328]);
  const markerRef = useRef<any>(null);

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
    [onLocationChange],
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

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [map, setMap] = useState<Map | null>(null);

  const displayMap = useMemo(
    () => (
        <MapContainer
            center={[-6.792354, 39.208328]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%', borderRadius: 'var(--radius)' }}
            whenCreated={setMap}
            placeholder={<Skeleton className="h-full w-full" />}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker onLocationChange={onLocationChange} />
        </MapContainer>
    ), [onLocationChange]);

  return <div>{displayMap}</div>;
}
