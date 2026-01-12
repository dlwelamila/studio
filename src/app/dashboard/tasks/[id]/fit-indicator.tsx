'use client';
import { useMemo } from 'react';
import { CheckCircle2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, Helper } from '@/lib/data';
import { cn } from '@/lib/utils';

type FitIndicatorProps = {
  task: Task;
  helper: Helper;
};

type FitLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

type FitResult = {
  level: FitLevel;
  reason: string;
};

// --- Client-Side Fit Algorithms (Placeholder for Backend API) ---

const getSkillFit = (task: Task, helper: Helper): FitResult => {
  if (helper.serviceCategories.includes(task.category)) {
    return { level: 'High', reason: 'You specialize in this category.' };
  }
  // In a real API, you could add more nuanced logic here
  // e.g., checking for partial matches or related skills.
  return { level: 'Medium', reason: 'Outside your primary categories.' };
};

const getDistanceFit = (task: Task, helper: Helper): FitResult => {
  // Placeholder logic. A real implementation would use the GeoPoints.
  if (!task.location || !helper.serviceAreas) {
    return { level: 'Unknown', reason: 'Location data not available.' };
  }
  
  // Simulate checking if task area is in helper's service areas
  const taskArea = task.area.toLowerCase();
  const helperAreas = helper.serviceAreas.map(a => a.toLowerCase());

  if(helperAreas.some(area => taskArea.includes(area))) {
    return { level: 'High', reason: 'Task is in your service area.' };
  }

  return { level: 'Low', reason: 'Task is outside your service areas.' };
};

const getTimeFit = (task: Task): FitResult => {
  // Placeholder logic. A real implementation would check against helper's availability blocks.
  if (task.timeWindow.toLowerCase() === 'flexible') {
    return { level: 'High', reason: 'Task has a flexible schedule.' };
  }
  return { level: 'Medium', reason: 'Task has a specific time window.' };
};


export function FitIndicator({ task, helper }: FitIndicatorProps) {
  const skillFit = useMemo(() => getSkillFit(task, helper), [task, helper]);
  const distanceFit = useMemo(() => getDistanceFit(task, helper), [task, helper]);
  const timeFit = useMemo(() => getTimeFit(task), [task]);

  const getBadgeVariant = (level: FitLevel) => {
    switch (level) {
      case 'High': return 'secondary';
      case 'Medium': return 'outline';
      case 'Low': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getIcon = (level: FitLevel) => {
      switch (level) {
          case 'High': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
          case 'Medium': return <Clock className="h-4 w-4 text-yellow-600" />;
          case 'Low': return <AlertCircle className="h-4 w-4 text-red-600" />;
          default: return <MapPin className="h-4 w-4 text-muted-foreground" />;
      }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
        <CardDescription>
          How well this task matches your profile and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IndicatorCard title="Skill Match" fit={skillFit} icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />} />
        <IndicatorCard title="Distance" fit={distanceFit} icon={<MapPin className="h-5 w-5 text-muted-foreground" />} />
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
    const badgeVariant = useMemo(() => {
        switch (fit.level) {
            case 'High': return 'secondary';
            case 'Medium': return 'outline';
            case 'Low': return 'destructive';
            default: return 'outline';
        }
    }, [fit.level]);

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
                <div className={cn("text-lg font-bold", textColor)}>{fit.level}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{fit.reason}</p>
        </div>
    )
}
