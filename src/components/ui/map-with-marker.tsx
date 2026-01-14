'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons (Leaflet + bundlers)
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
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
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
        if (marker) setPosition(marker.getLatLng());
      },
      dragend() {
        const marker = markerRef.current;
        if (marker) {
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
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 p-2 rounded-md shadow-lg backdrop-blur-sm text-xs w-11/12 text-center">
        <p className="font-mono">
          <span className="font-semibold">Location:</span> {address}
        </p>
      </div>

      <Marker
        draggable
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    </>
  );
};

export default function MapWithMarker({ onLocationChange }: MapWithMarkerProps) {
  // React-Leaflet v4: obtain the Leaflet map via a ref callback (recommended approach since whenCreated is gone)
  const mapRef = useRef<L.Map | null>(null);

  // Store the actual container element Leaflet is attached to (Leaflet: map.getContainer()).
  const containerElRef = useRef<HTMLElement | null>(null);

  const handleMapRef = useCallback((map: L.Map | null) => {
    if (!map) return;
    mapRef.current = map;
    containerElRef.current = map.getContainer(); // Leaflet API
  }, []);

  useEffect(() => {
    return () => {
      const map = mapRef.current;
      const container = containerElRef.current;

      // Proper Leaflet teardown
      if (map) {
        map.off();
        map.remove();
        mapRef.current = null;
      }

      /**
       * Dev/HMR/StrictMode/Suspense can cause the same DOM node to be reused.
       * Leaflet tracks initialization on the container (e.g. _leaflet_id).
       * Clearing it prevents "Map container is already initialized."
       */
      if (container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyContainer = container as any;
        if (anyContainer._leaflet_id) {
          try {
            delete anyContainer._leaflet_id;
          } catch {
            // ignore
          }
        }
        containerElRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={handleMapRef}
        center={[-6.792354, 39.208328]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
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
