'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapWithMarkerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition?: { lat: number; lng: number };
}

export default function MapWithMarker({ onLocationChange, initialPosition }: MapWithMarkerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const initializedRef = useRef(false);

  const defaultPosition = initialPosition || { lat: -6.792354, lng: 39.208328 };

  useEffect(() => {
    if (!mapContainerRef.current || initializedRef.current) return;
    
    initializedRef.current = true;
    
    const map = L.map(mapContainerRef.current).setView([defaultPosition.lat, defaultPosition.lng], 13);
    mapRef.current = map;
    
    // Fix for default marker icon path issue with bundlers
    const icon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([defaultPosition.lat, defaultPosition.lng], { draggable: true, icon: icon });
    marker.addTo(map);
    markerRef.current = marker;

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    // Fire initial location
    onLocationChange(defaultPosition.lat, defaultPosition.lng);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapContainerRef} className="h-[400px] w-full rounded-lg" />;
}