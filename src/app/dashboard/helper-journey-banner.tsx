
'use client';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader, Hourglass, Sparkles, UserCheck } from 'lucide-react';

import type { Helper } from '@/lib/data';
import { useHelperJourney } from '@/hooks/use-helper-journey';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type HelperJourneyBannerProps = {
  helper: Helper;
};

const bannerConfig = {
    PROFILE_INCOMPLETE: {
        icon: <AlertCircle className="h-4 w-4" />,
        title: 'Complete your profile to get verified',
        description: 'You must complete your profile before you can send offers and get assigned to tasks.',
        variant: 'destructive',
        cta: {
            text: 'Complete Profile',
            href: '/dashboard/profile'
        }
    },
    PENDING_VERIFICATION: {
        icon: <Hourglass className="h-4 w-4" />,
        title: 'Verification in Progress',
        description: 'We are reviewing your profile. This usually takes 1-2 business days. We will notify you once it is complete.',
        variant: 'default',
        cta: {
            text: 'View Profile',
            href: '/dashboard/profile'
        }
    },
    VERIFIED_READY: {
        icon: <UserCheck className="h-4 w-4" />,
        title: "You're verified! Start sending offers.",
        description: "Your profile is approved. Browse tasks and send offers to start earning.",
        variant: 'default',
        cta: {
            text: 'Browse Tasks',
            href: '/dashboard/browse'
        }
    },
    ACTIVE: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: 'You are active and ready for tasks',
        description: 'Keep your reliability score high and complete tasks professionally to grow.',
        variant: 'default',
        cta: null
    },
    GROWING: {
        icon: <Sparkles className="h-4 w-4" />,
        title: 'You are a top-rated helper!',
        description: 'Customers see your high rating. Keep up the great work!',
        variant: 'default',
        cta: null
    },
    SUSPENDED: {
        icon: <AlertCircle className="h-4 w-4" />,
        title: 'Your account is temporarily suspended',
        description: 'Please contact support for more information on how to reactivate your account.',
        variant: 'destructive',
        cta: {
            text: 'Contact Support',
            href: '/support' // Assuming a support page exists
        }
    },
    REGISTERED: {
         icon: <Loader className="h-4 w-4" />,
        title: 'Welcome to tasKey!',
        description: 'The first step is to build your profile so customers can find you.',
        variant: 'default',
        cta: {
            text: 'Create Profile',
            href: '/onboarding/create-profile?role=helper'
        }
    }
}


export function HelperJourneyBanner({ helper }: HelperJourneyBannerProps) {
  const journey = useHelperJourney(helper);

  if (!journey) {
    return null; // Or a skeleton loader
  }

  const { lifecycleStage, profileCompletion } = journey;
  const config = bannerConfig[lifecycleStage] || bannerConfig.REGISTERED;

  // Do not show the banner for these lifecycle stages as it's no longer a primary instruction.
  if (['VERIFIED_READY', 'ACTIVE', 'GROWING'].includes(lifecycleStage)) {
    return null;
  }

  return (
    <Alert variant={config.variant as any} className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {config.icon}
        <div className="flex-grow">
          <AlertTitle>{config.title}</AlertTitle>
          <AlertDescription>
            {config.description}
          </AlertDescription>

          {lifecycleStage === 'PROFILE_INCOMPLETE' && (
            <div className="mt-2">
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-xs text-foreground/80">Profile Completion</span>
                    <span className="text-xs font-semibold">{profileCompletion.percent}%</span>
                </div>
              <Progress value={profileCompletion.percent} className="h-2" />
            </div>
          )}

        </div>
        {config.cta && (
          <Button asChild className="w-full sm:w-auto flex-shrink-0">
            <Link href={config.cta.href}>{config.cta.text}</Link>
          </Button>
        )}
      </div>
    </Alert>
  );
}
