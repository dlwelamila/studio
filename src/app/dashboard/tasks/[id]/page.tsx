'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star } from 'lucide-react';
import { format } from 'date-fns';

import { useUserRole } from '@/context/user-role-context';
import { useDoc, useCollection, useMemoFirebase } from '@/firebase';

import { doc, collection, query, where } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { OfferCard } from './offer-card';
import { RecommendedHelpers } from './recommended-helpers';
import type { Task, Offer, Customer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { role } = useUserRole();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const taskRef = useMemoFirebase(() => firestore && doc(firestore, 'tasks', id), [firestore, id]);
  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const customerRef = useMemoFirebase(() => firestore && task && doc(firestore, 'customers', task.customerId), [firestore, task]);
  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);

  const offersQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'tasks', id, 'offers')), [firestore, id]);
  const { data: offers, isLoading: isOffersLoading } = useCollection<Offer>(offersQuery);

  const isCustomerView = role === 'customer';
  const hasMadeOffer = !!offers?.some(o => o.helperId === currentUser?.uid);
  
  if (isTaskLoading) {
    return <TaskDetailSkeleton />;
  }

  if (!task) {
    return (
      <div>
        <h1 className="font-headline text-2xl font-bold">Task not found</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={isCustomerView ? "/dashboard" : "/dashboard"}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            Task Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Task ID: {task.id}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">{task.title}</CardTitle>
                <CardDescription>{task.category} &middot; {task.area}</CardDescription>
              </div>
               <Badge
                className="capitalize text-nowrap"
                variant={
                    task.status === 'OPEN' ? 'secondary' : task.status === 'COMPLETED' ? 'default' : 'outline'
                }
                >
                {task.status.replace('_', ' ')}
                </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {task.description}
              </p>
              <Separator className="my-6" />
               <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold text-foreground">Budget</div>
                    <div className="text-primary font-bold text-lg">
                        {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                    </div>
                </div>
                 <div>
                    <div className="font-semibold text-foreground">Posted On</div>
                    <div className="text-muted-foreground">
                        {format(task.createdAt.toDate(), 'PP')}
                    </div>
                </div>
               </div>
            </CardContent>
          </Card>
          
          {isCustomerView ? (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Offers ({offers?.length || 0})</CardTitle>
                        <CardDescription>
                            Review the offers from helpers below. You can view their profile before accepting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {isOffersLoading && <Skeleton className="h-24 w-full" />}
                        {!isOffersLoading && offers && offers.length > 0 ? offers.map(offer => (
                            <OfferCard key={offer.id} offer={offer} />
                        )) : (
                            <div className="text-center py-8 text-muted-foreground">No offers received yet.</div>
                        )}
                    </CardContent>
                </Card>
                <RecommendedHelpers task={task} />
            </>
          ) : (
            <>
                {task.status === 'OPEN' && !hasMadeOffer && (
                    <Card>
                        <CardHeader>
                        <CardTitle className="font-headline">Make an Offer</CardTitle>
                        <CardDescription>
                            Submit your price and a message to the customer.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Your Price (TZS)</Label>
                                    <Input id="price" type="number" placeholder="e.g., 25,000" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="eta">Availability / ETA</Label>
                                    <Input id="eta" type="text" placeholder="e.g., Tomorrow afternoon" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message">Message to Customer</Label>
                                    <Textarea id="message" placeholder="Introduce yourself and explain why you're a good fit for this task." className="min-h-24" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto">Submit Offer</Button>
                        </CardFooter>
                    </Card>
                )}
                {task.status === 'OPEN' && hasMadeOffer && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Offer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">You have already submitted an offer for this task. The customer will be in touch if they select you.</p>
                        </CardContent>
                    </Card>
                )}
                 {task.status !== 'OPEN' && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Task Not Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">This task is no longer open for offers.</p>
                        </CardContent>
                    </Card>
                )}
            </>
          )}

        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Posted by</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isCustomerLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : customer ? (
                <div className="flex items-center gap-4">
                    <Image
                        alt="Customer avatar"
                        className="rounded-full"
                        height={40}
                        src={customer.profilePhotoUrl || ''}
                        style={{ aspectRatio: '40/40', objectFit: 'cover' }}
                        width={40}
                    />
                    <div>
                        <div className="font-semibold">{customer.fullName}</div>
                        {/* <div className="text-sm text-muted-foreground">{customer?.location}</div> */}
                    </div>
                </div>
              ) : null}
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-muted-foreground text-muted-foreground" />
                    <span className="ml-1 text-foreground font-semibold">4.0</span> (5 reviews)
                 </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function TaskDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-7 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <Skeleton className="h-6 w-1/3" />
             </CardHeader>
             <CardContent>
                <Skeleton className="h-24 w-full" />
             </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
