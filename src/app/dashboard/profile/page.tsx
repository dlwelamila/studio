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
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon, MessageSquare, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import type { Helper, Customer, Review } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from './review-card';

export default function ProfilePage() {
  const { role } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Helper | Customer>(userRef);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser || role !== 'helper') return null;
    return query(collection(firestore, 'feedbacks'), where('helperId', '==', authUser.uid));
  }, [firestore, authUser, role]);

  const { data: reviews, isLoading: areReviewsLoading } = useCollection<Review>(reviewsQuery);


  if (isUserLoading || isProfileLoading || !userProfile) {
    return <ProfileSkeleton />;
  }

  const helperProfile = role === 'helper' ? (userProfile as Helper) : null;
  
  return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {helperProfile?.serviceAreas && (
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Service Areas</p>
                        <p className="font-semibold">{helperProfile.serviceAreas.join(', ')}</p>
                    </div>
                </div>
                )}
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Member Since</p>
                        <p className="font-semibold">{format(helperProfile?.memberSince.toDate() ?? new Date(), 'MMMM yyyy')}</p>
                    </div>
                </div>
                {helperProfile && (
                    <>
                        <div className="flex items-center gap-3">
                            <BadgeCheckIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Verification</p>
                                <div className="font-semibold">
                                    {helperProfile.verificationStatus === 'Verified' ? (
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
                                <p className="font-semibold">{helperProfile.rating ? `${helperProfile.rating} / 5.0` : 'No ratings yet'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Completed Gigs</p>
                                <p className="font-semibold">{helperProfile.completedTasks || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Reliability</p>
                                <p className="font-semibold">{helperProfile.reliabilityIndicator || 'Not Yet Rated'}</p>
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
         {helperProfile && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Reviews ({reviews?.length ?? 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {areReviewsLoading && Array.from({length: 2}).map((_, i) => <ReviewCardSkeleton key={i} />)}
                    
                    {!areReviewsLoading && reviews && reviews.length > 0 ? (
                        reviews.map(review => <ReviewCard key={review.id} review={review} />)
                    ) : (
                        !areReviewsLoading && (
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
