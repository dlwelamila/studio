'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from './skeleton';

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const MapWithMarker = dynamic(() => import('./map-with-marker'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [instanceId, setInstanceId] = useState<string>('');
  const hasInitializedRef = useRef(false);

  // Generate a unique ID on mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      setInstanceId(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      hasInitializedRef.current = true;
    }
    
    // Cleanup function
    return () => {
      hasInitializedRef.current = false;
      // Force cleanup of any Leaflet maps
      if (typeof window !== 'undefined') {
        const leafletContainers = document.querySelectorAll('.leaflet-container');
        leafletContainers.forEach(container => {
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        });
      }
    };
  }, []);

  if (!instanceId) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapWithMarker 
        key={instanceId} // 🔑 CRITICAL: Unique key forces fresh mount
        onLocationChange={onLocationChange} 
      />
    </div>
  );
}