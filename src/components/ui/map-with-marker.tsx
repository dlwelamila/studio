'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from './skeleton';
import { MapPin } from 'lucide-react';

interface MapWithMarkerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition?: { lat: number; lng: number };
}

export default function MapWithMarker({ onLocationChange, initialPosition }: MapWithMarkerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [address, setAddress] = useState('Fetching address...');
  
  const initializedRef = useRef(false);

  const defaultPosition = initialPosition || { lat: -6.792354, lng: 39.208328 };

  const fetchAddress = async (lat: number, lng: number) => {
    setAddress('Loading...');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address not found.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Could not fetch address.');
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || initializedRef.current) return;
    
    initializedRef.current = true;
    
    const map = L.map(mapContainerRef.current).setView([defaultPosition.lat, defaultPosition.lng], 13);
    mapRef.current = map;
    
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

    const handleLocationUpdate = (lat: number, lng: number) => {
        onLocationChange(lat, lng);
        fetchAddress(lat, lng);
    }

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      handleLocationUpdate(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      handleLocationUpdate(pos.lat, pos.lng);
    });

    handleLocationUpdate(defaultPosition.lat, defaultPosition.lng);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div 
        className="absolute top-0 left-0 right-0 z-[1000] p-2 bg-background/80 backdrop-blur-sm rounded-t-lg"
      >
        <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"/>
            <p className="text-xs text-muted-foreground">{address}</p>
        </div>
      </div>
      <div ref={mapContainerRef} className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
