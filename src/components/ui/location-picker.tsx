"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"
import "leaflet-defaulticon-compatibility"

type LocationPickerProps = {
  onLocationChange: (lat: number, lng: number) => void
}

// Default center for the map (Dar es Salaam)
const defaultCenter: [number, number] = [-6.792354, 39.208328]

function DraggableMarker({ onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState(defaultCenter)
  const markerRef = useRef(null)

  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      onLocationChange(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  
  useEffect(() => {
    // Set initial location
    onLocationChange(defaultCenter[0], defaultCenter[1]);
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = (marker as any).getLatLng()
          setPosition([lat, lng])
          onLocationChange(lat, lng)
        }
      },
    }),
    [onLocationChange]
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  )
}

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  return (
    <div className="h-64 w-full rounded-md border overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  )
}
