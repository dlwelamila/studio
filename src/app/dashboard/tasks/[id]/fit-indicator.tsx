
'use client';
import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { GeoPoint } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task, Helper } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


type FitIndicatorProps = {
  task: Task;
};

type FitLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

type FitResult = {
  level: FitLevel;
  reason: string;
  km?: number;
};


function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}


const getSkillFit = (task: Task, helper: Helper): FitResult => {
  if (!task.category || !helper.serviceCategories) {
    return { level: 'Unknown', reason: "Category or skills missing." };
  }
  const isMatch = helper.serviceCategories.includes(task.category);
  if (isMatch) {
    return { level: 'High', reason: "You specialize in this task's category." };
  }
  return { level: 'Low', reason: "This task is outside your primary service categories." };
};

const getDistanceFit = (task: Task, helperGeo?: { lat: number; lng: number }): FitResult => {
    const taskLocation = task.location as GeoPoint | undefined;
    if (!helperGeo || !taskLocation) {
        return { level: 'Unknown', reason: "Location data unavailable." };
    }

    const distanceKm = getHaversineDistance(taskLocation.latitude, taskLocation.longitude, helperGeo.lat, helperGeo.lng);
    const thresholds = { near: 3, moderate: 8 };

    if (distanceKm <= thresholds.near) {
        return { level: 'High', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is very close to you." };
    }
    if (distanceKm <= thresholds.moderate) {
        return { level: 'Medium', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is a short drive away." };
    }
    return { level: 'Low', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is far from your location." };
};


const getTimeFit = (task: Task): FitResult => {
    if (task.timeWindow?.toLowerCase() === 'flexible') {
        return { level: 'High', reason: 'Task has a flexible schedule.' };
    }
    if(task.timeWindow){
        return { level: 'Medium', reason: 'Task has a specific time window.' };
    }
    return { level: 'Unknown', reason: 'Time preference not specified.' };
};


export function FitIndicator({ task }: FitIndicatorProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const helperRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'helpers', user.uid) : null, [firestore, user]);
  const { data: helper, isLoading: isHelperLoading } = useDoc<Helper>(helperRef);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
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

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
        setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const isLoading = isHelperLoading;

  if (isLoading) {
    return <FitIndicatorSkeleton />;
  }

  if (!helper) {
    return (
       <Card>
          <CardHeader>
              <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-sm text-destructive text-center py-4 flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Could not load your Helper profile to determine fit.
              </div>
          </CardContent>
       </Card>
    )
  }

  const skillMatch = getSkillFit(task, helper);
  const timeFit = getTimeFit(task);
  const distance = getDistanceFit(task, location || undefined);
  
  const finalDistance = locationError ? { level: 'Unknown', reason: 'Could not get your location.' } as FitResult : distance;

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
    fit: FitResult;
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
