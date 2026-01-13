'use client';
import { CheckCircle, Circle, Award, UserCheck, Check, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HelperJourney } from '@/hooks/use-helper-journey';
import { cn } from '@/lib/utils';

type JourneyChecklistProps = {
  journey: HelperJourney;
};

export function JourneyChecklist({ journey }: JourneyChecklistProps) {
  const { lifecycleStage, verificationStatus, stats } = journey;

  const checklistItems = [
    {
      id: 'registered',
      label: 'Account Registered',
      isComplete: true, // Always complete if they are seeing this
    },
    {
      id: 'profile_complete',
      label: 'Profile Complete',
      isComplete: lifecycleStage !== 'PROFILE_INCOMPLETE',
    },
    {
      id: 'verified',
      label: 'Identity Verified',
      isComplete: verificationStatus === 'APPROVED',
    },
    {
      id: 'first_gig',
      label: 'First Gig Completed',
      isComplete: stats.jobsCompleted > 0,
    },
    {
      id: 'top_rated',
      label: 'Become a Top Rated Helper',
      isComplete: lifecycleStage === 'GROWING',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span>Your Journey</span>
        </CardTitle>
        <CardDescription>
          Complete these milestones to unlock more opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {checklistItems.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
              {item.isComplete ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className={cn('text-sm', item.isComplete ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
              {item.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
