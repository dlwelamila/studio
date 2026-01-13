'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import { Skeleton } from './skeleton';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const MapWithMarker = dynamic(() => import('./map-with-marker'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapWithMarker onLocationChange={onLocationChange} />
    </div>
  );
}
    