'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import { Skeleton } from './skeleton';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

// Dynamically import the map component itself to ensure it's client-side only
const MapWithMarker = dynamic(() => import('./map-with-marker'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <MapWithMarker onLocationChange={onLocationChange} />
    </div>
  );
}
