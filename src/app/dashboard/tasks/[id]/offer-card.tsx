
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, AlarmClock } from 'lucide-react';
import { doc, serverTimestamp } from 'firebase/firestore';

import type { Offer, Helper, Task } from '@/lib/data';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type OfferCardProps = {
  offer: Offer;
  task: Task;
  onAccept: () => void;
};

export function OfferCard({ offer, task, onAccept }: OfferCardProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const helperRef = useMemoFirebase(() => firestore && doc(firestore, 'helpers', offer.helperId), [firestore, offer.helperId]);
  const { data: helper, isLoading } = useDoc<Helper>(helperRef);

  const handleAcceptOffer = async () => {
    if (!firestore || !helper) return;

    const taskRef = doc(firestore, 'tasks', offer.taskId);
    const offerRef = doc(firestore, 'tasks', offer.taskId, 'offers', offer.id);

    // 1. Update the task status, assign the helper, and store final price
    updateDocumentNonBlocking(taskRef, {
      status: 'ASSIGNED',
      assignedHelperId: offer.helperId,
      acceptedOfferPrice: offer.price,
      assignedAt: serverTimestamp(),
    });

    // 2. Update the offer status
    updateDocumentNonBlocking(offerRef, {
      status: 'ACCEPTED',
    });
    
    onAccept();

    toast({
      title: 'Offer Accepted!',
      description: `You have assigned ${helper?.fullName} to this task.`,
    });
    
    // In a real app, you would also update all other offers to 'REJECTED'
    // and send notifications. This is simplified for now.
  };

  if (isLoading) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="grid gap-1">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  if (!helper) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Image
              alt="Helper avatar"
              className="rounded-full"
              height={48}
              src={helper.profilePhotoUrl}
              style={{ aspectRatio: '48/48', objectFit: 'cover' }}
              width={48}
            />
            <div className="grid gap-1">
              <div className="font-semibold">{helper.fullName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{helper.rating || 'New'}</span>
                </div>
                <span>&middot;</span>
                <div>{helper.completedTasks || 0} tasks completed</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">{`TZS ${offer.price.toLocaleString()}`}</div>
            <div className="text-xs text-muted-foreground">Offered Price</div>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">{offer.message}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-3">
            <AlarmClock className="h-4 w-4 mr-2" />
            {offer.eta}
        </div>
        <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" asChild>
                <Link href={`/profile/${helper.id}`} target="_blank">View Profile</Link>
            </Button>
            {task.status === 'OPEN' && (
              <Button onClick={handleAcceptOffer}>Accept Offer</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

    