'use client';

import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LatLng } from 'leaflet';
import { Skeleton } from './skeleton';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const DraggableMarker = ({ onLocationChange }: LocationPickerProps) => {
  const [position, setPosition] = useState<LatLngExpression>([-6.792354, 39.208328]);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return (
    <Marker
      draggable={true}
      eventHandlers={useMemo(
        () => ({
          dragend(e) {
            const marker = e.target;
            const newPos = marker.getLatLng();
            setPosition(newPos);
            onLocationChange(newPos.lat, newPos.lng);
          },
        }),
        [onLocationChange],
      )}
      position={position}
    />
  );
};

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  if (typeof window === 'undefined') {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <MapContainer center={[-6.792354, 39.208328]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: 'var(--radius)' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker onLocationChange={onLocationChange} />
    </MapContainer>
  );
}
