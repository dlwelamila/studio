'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserRole } from '@/context/user-role-context';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon, MessageSquare, Shield, Phone, KeyRound, Percent, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import type { Helper, Customer, Feedback } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from './review-card';
import { HelperJourneyBanner } from '../helper-journey-banner';
import { MfaEnrollmentDialog } from './mfa-enrollment-dialog';
import { useHelperJourney } from '@/hooks/use-helper-journey';
import { cn } from '@/lib/utils';
import { PhoneVerificationDialog } from './phone-verification-dialog';


export default function ProfilePage() {
  const { role, isRoleLoading } = useUserRole();
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);

  const { data: userProfile, isLoading: isProfileLoading, mutate: mutateProfile } = useDoc<Helper | Customer>(userRef);

  const feedbacksQuery = useMemoFirebase(() => {
    if (!firestore || !authUser || role !== 'helper') return null;
    return query(collection(firestore, 'feedbacks'), where('helperId', '==', authUser.uid));
  }, [firestore, authUser, role]);

  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);
  
  const helperProfile = role === 'helper' ? (userProfile as Helper) : null;
  const customerProfile = role === 'customer' ? (userProfile as Customer) : null;
  
  const journey = useHelperJourney(helperProfile);
  const isPhoneVerified = role === 'customer' ? customerProfile?.phoneVerified : true; // Assume helpers are always phone verified for now
  
  const isLoading = isAuthLoading || isRoleLoading || isProfileLoading;

  if (isLoading || !userProfile) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div id="recaptcha-container" />
      {helperProfile && <HelperJourneyBanner helper={helperProfile} />}
      <div className="grid gap-4 md:grid-cols-[1fr_350px]">
        <div className="grid auto-rows-max items-start gap-4">
          <h1 className="font-headline text-2xl font-bold">Your Profile</h1>
          <Card>
              <CardHeader>
                  <div className="flex items-center gap-6">
                      <Image
                          src={userProfile.profilePhotoUrl}
                          width={96}
                          height={96}
                          alt="Avatar"
                          className="overflow-hidden rounded-full object-cover"
                      />
                      <div>
                          <CardTitle className="font-headline text-3xl">{userProfile.fullName}</CardTitle>
                          <CardDescription className="text-base">{userProfile.email || userProfile.phoneNumber}</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 text-sm">
                  <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                          <p className="text-muted-foreground">Phone Number</p>
                          <div className='flex items-center flex-wrap gap-2 mt-1'>
                            <p className="font-semibold">{userProfile.phoneNumber}</p>
                            {isPhoneVerified === true && (
                                <Badge variant="secondary" className='gap-1 border-green-500/50 text-green-700'>
                                    <BadgeCheckIcon className="h-3 w-3" />
                                    Verified
                                </Badge>
                            )}
                             {isPhoneVerified === false && (
                                <>
                                <Badge variant="destructive">Unverified</Badge>
                                <PhoneVerificationDialog phoneNumber={userProfile.phoneNumber} userDocRef={userRef} onSuccess={mutateProfile} />
                                </>
                             )}
                          </div>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                          <p className="text-muted-foreground">Member Since</p>
                          <p className="font-semibold mt-1">{userProfile?.memberSince ? format(userProfile.memberSince.toDate(), 'MMMM yyyy') : 'N/A'}</p>
                      </div>
                  </div>
                  {helperProfile && journey && (
                      <>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-muted-foreground">Service Areas</p>
                                <p className="font-semibold mt-1">{helperProfile.serviceAreas?.join(', ') || 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                              <BadgeCheckIcon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Verification</p>
                                  <div className="font-semibold mt-1">
                                      {helperProfile.verificationStatus === 'APPROVED' ? (
                                          <Badge variant="secondary" className='gap-1 border-green-500/50 text-green-700'>
                                            <BadgeCheckIcon className="h-3 w-3" />
                                            Verified
                                          </Badge>
                                      ) : (
                                          <Badge variant="destructive">Pending</Badge>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <div className="flex items-start gap-3">
                              <Star className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Rating</p>
                                  <p className="font-semibold mt-1">{journey.stats.ratingAvg ? `${journey.stats.ratingAvg.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-3">
                              <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Completed Gigs</p>
                                  <p className="font-semibold mt-1">{journey.stats.jobsCompleted || 0}</p>
                              </div>
                          </div>
                           <div className="flex items-start gap-3">
                              <Target className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Total Tasks</p>
                                  <p className="font-semibold mt-1">{journey.stats.totalAttempted || 0}</p>
                              </div>
                          </div>
                           <div className="flex items-start gap-3">
                              <Percent className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Completion Rate</p>
                                  <p className={cn("font-semibold mt-1", journey.stats.completionRate < 0.8 && "text-destructive")}>
                                    {(journey.stats.completionRate * 100).toFixed(0)}%
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-start gap-3 md:col-span-2">
                              <Shield className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Reliability Score</p>
                                  <p className={cn(
                                    "font-semibold mt-1",
                                     journey.stats.reliabilityLevel === 'GREEN' && "text-green-700",
                                     journey.stats.reliabilityLevel === 'YELLOW' && "text-yellow-600",
                                     journey.stats.reliabilityLevel === 'RED' && "text-destructive"
                                  )}>{journey.stats.reliabilityLevel}</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-3 md:col-span-2">
                              <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                              <div>
                                  <p className="text-muted-foreground">Skills</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                      {helperProfile.serviceCategories?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                  </div>
                              </div>
                          </div>
                          <div className='md:col-span-2'>
                              <h3 className="font-semibold mb-2">About Me</h3>
                              <p className="text-muted-foreground">{helperProfile.aboutMe}</p>
                          </div>
                      </>
                  )}
              </div>
              </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        <span>Security</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MfaEnrollmentDialog />
                </CardContent>
            </Card>

            {helperProfile && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Reviews ({feedbacks?.length ?? 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {areFeedbacksLoading && Array.from({length: 2}).map((_, i) => <ReviewCardSkeleton key={i} />)}
                        
                        {!areFeedbacksLoading && feedbacks && feedbacks.length > 0 ? (
                            feedbacks.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            !areFeedbacksLoading && (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No reviews yet. Complete more tasks to get feedback!
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
    return (
        <div className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                 <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-1" />
        </div>
    );
}

function ProfileSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className='space-y-2'>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <div className='space-y-2'>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
