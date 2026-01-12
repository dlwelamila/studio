'use client';
import { useState, useEffect, useMemo } from 'react';
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

export function FitIndicator({ task }: FitIndicatorProps) {
  const { user } = useUser();
  const auth = useAuth();
  const [fitData, setFitData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!task || !user || !auth) return;

    const fetchFitData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a future step (B3), we will add live location fetching here.
        // For now, we simulate passing a location for Dar es Salaam.
        const helperLat = -6.7924;
        const helperLng = 39.2083;
        
        const token = await auth.currentUser?.getIdToken();

        const response = await fetch(
          `/api/tasks/${task.id}/fit-indicator?lat=${helperLat}&lng=${helperLng}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
           const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch fit data');
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
  }, [task, user, auth]);

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
        <IndicatorCard title="Distance" fit={distance} icon={<MapPin className="h-5 w-5 text-muted-foreground" />} />
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
