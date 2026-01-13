'use client';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { HelperJourney } from '@/hooks/use-helper-journey';
import { cn } from '@/lib/utils';

type TierProgressCardProps = {
  journey: HelperJourney;
};

export function TierProgressCard({ journey }: TierProgressCardProps) {
  const { tier } = journey;

  if (!tier) {
    return null;
  }

  const tierColors = {
    Bronze: 'bg-[#CD7F32] text-white',
    Silver: 'bg-[#C0C0C0] text-black',
    Gold: 'bg-[#FFD700] text-black',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span>Helper Tier</span>
          </div>
          <Badge className={cn(tierColors[tier.current.name as keyof typeof tierColors])}>
            {tier.current.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tier.next ? (
          <>
            <Progress value={tier.progress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground text-center">
              Complete {tier.next.jobsRequired - tier.current.jobsCompleted} more jobs to reach{' '}
              <span className="font-bold text-foreground">{tier.next.name}</span>!
            </p>
          </>
        ) : (
          <p className="text-sm text-center font-semibold text-primary">
            You have reached the highest tier!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
