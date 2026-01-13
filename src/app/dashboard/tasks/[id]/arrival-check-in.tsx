'use client';

import { useState } from 'react';
import { serverTimestamp, GeoPoint, DocumentReference } from 'firebase/firestore';
import { MapPin, Loader, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/data';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ArrivalCheckInProps = {
  task: Task;
  taskRef: DocumentReference;
  mutateTask: () => void;
};

// Haversine distance formula to calculate distance between two lat/lng points in meters
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function ArrivalCheckIn({ task, taskRef, mutateTask }: ArrivalCheckInProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const taskLocation = task.location as GeoPoint | undefined;

        if (!taskLocation) {
          setError('Task location is missing. Cannot verify arrival.');
          setIsLoading(false);
          return;
        }

        const distance = getHaversineDistance(
          latitude,
          longitude,
          taskLocation.latitude,
          taskLocation.longitude
        );

        if (distance > 100) { // 100 meter radius as per blueprint
          setError(`You are too far from the task location (${distance.toFixed(0)}m away). You must be within 100m to check in.`);
          setIsLoading(false);
          return;
        }

        // Success! Update the task document
        updateDocumentNonBlocking(taskRef, {
          arrivedAt: serverTimestamp(),
          status: 'ACTIVE',
        });
        
        mutateTask(); // Trigger re-render of parent component
        
        toast({
          title: 'Check-In Successful!',
          description: 'You have arrived at the task location. The task is now active.',
        });
        
        setIsLoading(false);
      },
      (geoError) => {
        let message = 'Could not get your location. ';
        switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
                message += 'Please enable location permissions for this site.';
                break;
            case geoError.POSITION_UNAVAILABLE:
                message += 'Location information is unavailable.';
                break;
            case geoError.TIMEOUT:
                message += 'The request to get user location timed out.';
                break;
            default:
                message += 'An unknown error occurred.';
                break;
        }
        setError(message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Arrival Check-In</span>
        </CardTitle>
        <CardDescription>
          You must be at the task location to begin. This confirms your arrival to the customer and starts the task.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Check-In Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Button onClick={handleCheckIn} disabled={isLoading} className="w-full">
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying Location...' : 'Check-In at Task Location'}
        </Button>
      </CardContent>
    </Card>
  );
}
