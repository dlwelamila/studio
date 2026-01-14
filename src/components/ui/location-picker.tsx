'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { GeoPoint } from 'firebase/firestore';


const MapWithMarker = dynamic(() => import('./map-with-marker'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

interface LocationPickerProps {
    onLocationChange: (location: GeoPoint) => void;
}

export function LocationPicker({ onLocationChange }: LocationPickerProps) {

  const handleLocationChange = (lat: number, lng: number) => {
    const geoPoint = new GeoPoint(lat, lng);
    onLocationChange(geoPoint);
  };

  return (
    <div className="space-y-2 relative">
      <MapWithMarker onLocationChange={handleLocationChange} />
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to set the exact task location.
      </p>
    </div>
  );
}
