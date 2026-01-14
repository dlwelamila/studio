'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
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
  const defaultPosition = new LatLng(-6.792354, 39.208328);
  const [position, setPosition] = useState<LatLng>(defaultPosition);
  const [address, setAddress] = useState('Loading address...');
  const markerRef = useRef<L.Marker>(null);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setAddress('Fetching address...');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAddress(data.display_name || 'Address not found');
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Could not fetch address');
    }
  }, []);

  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationChange(newPos.lat, newPos.lng);
      fetchAddress(newPos.lat, newPos.lng);
      map.flyTo(newPos, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      drag() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onLocationChange(newPos.lat, newPos.lng);
          fetchAddress(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationChange, fetchAddress]
  );
  
  useEffect(() => {
    onLocationChange(defaultPosition.lat, defaultPosition.lng);
    fetchAddress(defaultPosition.lat, defaultPosition.lng);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 p-2 rounded-md shadow-lg backdrop-blur-sm text-xs w-11/12 text-center"
      >
        <p className='font-mono'>
            <span className="font-semibold">Location:</span> {address}
        </p>
      </div>
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    </>
  );
};

export default function MapWithMarker({ onLocationChange }: MapWithMarkerProps) {
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Cleanup effect to destroy the map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[-6.792354, 39.208328]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        ref={(map) => {
          if (map) {
            mapInstanceRef.current = map;
          }
        }}
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