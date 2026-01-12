'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CheckCircle2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';

type FitIndicatorProps = {
  task: Task;
};

type FitLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

type FitResult = {
  level: FitLevel;
  reason: string;
};

// Custom debounce hook implemented directly for simplicity
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function FitIndicator({ task }: FitIndicatorProps) {
  const { user } = useUser();
  const auth = useAuth();
  const [fitData, setFitData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // B3: Real-time Location State
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const debouncedLocation = useDebouncedValue(location, 800); // Debounce API calls by 800ms

  // B3: Watch for location changes
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Cleanup watcher on component unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);


  // B2: Data fetching logic, now dependent on debouncedLocation
  useEffect(() => {
    if (!task || !user || !auth) return;

    // If location is required and not available yet, wait.
    // If there's a location error, we can still proceed to show other fits.
    if (!debouncedLocation && !locationError) {
        setIsLoading(true); // Show loading skeleton while waiting for initial location
        return;
    }

    const fetchFitData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await auth.currentUser?.getIdToken();
        
        let apiUrl = `/api/tasks/${task.id}/fit-indicator`;
        if (debouncedLocation) {
          apiUrl += `?lat=${debouncedLocation.lat}&lng=${debouncedLocation.lng}`;
        }

        const response = await fetch(
          apiUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
           const errorText = await response.text();
           try {
             // Try to parse it as JSON, as it might be a structured error from our API
             const errorJson = JSON.parse(errorText);
             throw new Error(errorJson.error || 'Failed to fetch fit data');
           } catch (e) {
             // If parsing fails, it's likely HTML or plain text, so just throw that.
             throw new Error('An unexpected server error occurred.');
           }
        }
        const data = await response.json();
        setFitData(data);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
        setFitData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchFitData();
  }, [task, user, auth, debouncedLocation, locationError]); // Re-fetches when debounced location changes

  if (isLoading) {
    return <FitIndicatorSkeleton />;
  }
  
  if (error) {
      return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-destructive text-center py-4 flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Could not load task fit data: {error}
                </div>
            </CardContent>
         </Card>
      )
  }

  if (!fitData) {
     return null; // Don't render anything if there's no data and no error
  }

  const { skillMatch, distance, timeFit } = fitData;

  // Manually handle distance if there was a location error on the client
  const finalDistance = locationError ? { level: 'Unknown', reason: 'Could not get your location.' } : distance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
        <CardDescription>
          How well this task matches your profile and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IndicatorCard title="Skill Match" fit={skillMatch} icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />} />
        <IndicatorCard title="Distance" fit={finalDistance} icon={<MapPin className="h-5 w-5 text-muted-foreground" />} />
        <IndicatorCard title="Time" fit={timeFit} icon={<Clock className="h-5 w-5 text-muted-foreground" />} />
      </CardContent>
    </Card>
  );
}

type IndicatorCardProps = {
    title: string;
    fit: FitResult & { km?: number };
    icon: React.ReactNode;
}

function IndicatorCard({ title, fit, icon }: IndicatorCardProps) {
    const textColor = useMemo(() => {
        switch (fit.level) {
            case 'High': return 'text-green-700';
            case 'Medium': return 'text-yellow-700';
            case 'Low': return 'text-red-700';
            default: return 'text-muted-foreground';
        }
    }, [fit.level]);

    return (
        <div className="p-4 rounded-lg border bg-background/50 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <div className={cn("text-lg font-bold", textColor)}>{fit.level}</div>
                    {fit.km !== undefined && <div className="text-sm text-muted-foreground">({fit.km} km)</div>}
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{fit.reason}</p>
        </div>
    )
}

function FitIndicatorSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
                 <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
                 <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
