'use client';

import { use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon, MessageSquare, Shield, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import type { Helper, Feedback } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from '@/app/dashboard/profile/review-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'helpers', id);
  }, [firestore, id]);

  const { data: helperProfile, isLoading: isProfileLoading } = useDoc<Helper>(userRef);

  const feedbacksQuery = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'feedbacks'), where('helperId', '==', id));
  }, [firestore, id]);

  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);

  const isLoading = isProfileLoading;
  
  if (!isLoading && !helperProfile) {
    notFound();
  }

  if (isLoading || !helperProfile) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="bg-muted/40">
        <div className="container mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4 py-8 md:py-12">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="font-headline text-xl font-semibold tracking-tight">
                    Helper Profile
                </h1>
            </div>
             <div className="grid gap-4 md:grid-cols-[1fr_350px]">
                <div className="grid auto-rows-max items-start gap-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <Image
                                    src={helperProfile.profilePhotoUrl}
                                    width={96}
                                    height={96}
                                    alt="Avatar"
                                    className="overflow-hidden rounded-full object-cover"
                                />
                                <div>
                                    <CardTitle className="font-headline text-3xl">{helperProfile.fullName}</CardTitle>
                                    <CardDescription className="text-base">{helperProfile.email}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Service Areas</p>
                                    <p className="font-semibold">{helperProfile.serviceAreas.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Member Since</p>
                                    <p className="font-semibold">{helperProfile?.memberSince ? format(helperProfile.memberSince.toDate(), 'MMMM yyyy') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BadgeCheckIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Verification</p>
                                    <div className="font-semibold">
                                        {helperProfile.verificationStatus === 'APPROVED' ? (
                                            <Badge variant="secondary">Verified</Badge>
                                        ) : (
                                            <Badge variant="destructive">Pending Verification</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Rating</p>
                                    <p className="font-semibold">{helperProfile.stats.ratingAvg ? `${helperProfile.stats.ratingAvg.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Completed Gigs</p>
                                    <p className="font-semibold">{helperProfile.stats.jobsCompleted || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Reliability</p>
                                    <p className="font-semibold">{helperProfile.stats.reliabilityLevel || 'Not Yet Rated'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:col-span-2">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {helperProfile.serviceCategories?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-2'>
                                <h3 className="font-semibold mb-2">About Helper</h3>
                                <p className="text-muted-foreground">{helperProfile.aboutMe}</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-max items-start gap-4">
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
                                        No reviews yet.
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
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
    <div className="container mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4 py-8 md:py-12">
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
