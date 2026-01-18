'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, AlarmClock, Loader2 } from 'lucide-react';
import {
  doc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  addDoc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { format } from 'date-fns';

import type { Offer, Helper, Task } from '@/lib/data';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';

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
  const [isAccepting, setIsAccepting] = useState(false);
  
  const helperRef = useMemoFirebase(() => firestore && doc(firestore, 'helpers', offer.helperId), [firestore, offer.helperId]);
  const { data: helper, isLoading } = useDoc<Helper>(helperRef);

  const notifyHelper = async (helperId: string, message: string) => {
    if (!firestore || !task.customerId || !helperId) return;

    const threadId = `${task.id}_${task.customerId}_${helperId}`;
    const threadRef = doc(firestore, 'task_threads', threadId);

    const threadSnapshot = await getDoc(threadRef);
    if (!threadSnapshot.exists()) {
      return;
    }

    const messagesRef = collection(firestore, 'task_threads', threadId, 'messages');
    await addDoc(messagesRef, {
      senderId: task.customerId,
      text: message,
      createdAt: serverTimestamp(),
      type: 'SYSTEM',
    });

    const unreadField = `unreadCounts.${helperId}`;
    const updatePayload: Record<string, any> = {
      lastMessagePreview: message,
      lastMessageAt: serverTimestamp(),
      lastMessageSenderId: task.customerId,
      [unreadField]: increment(1),
    };

    await updateDoc(threadRef, updatePayload).catch(() => {});

    const participantRef = doc(firestore, 'task_participants', `${task.id}_${helperId}`);
    await updateDoc(participantRef, { lastMessageAt: serverTimestamp() }).catch(() => {});
  };

  const handleAcceptOffer = async () => {
    if (!firestore || !helper) return;

    setIsAccepting(true);

    const taskRef = doc(firestore, 'tasks', offer.taskId);

    try {
      await updateDoc(taskRef, {
        status: 'ASSIGNED',
        assignedHelperId: offer.helperId,
        acceptedOfferPrice: offer.price,
        acceptedOfferId: offer.id,
        allowOffers: false,
        assignedAt: serverTimestamp(),
      });

      const offersRef = collection(firestore, 'tasks', offer.taskId, 'offers');
      const offersSnapshot = await getDocs(offersRef);
      const offerBatch = writeBatch(firestore);

      offersSnapshot.forEach((offerSnap) => {
        const offerData = offerSnap.data() as Offer;
        if (offerSnap.id === offer.id) {
          offerBatch.update(offerSnap.ref, { status: 'ACCEPTED' });
        } else if (offerData.status === 'SUBMITTED') {
          offerBatch.update(offerSnap.ref, { status: 'REJECTED' });
        }
      });

      if (!offersSnapshot.empty) {
        await offerBatch.commit();
      }

      const participantQuery = query(
        collection(firestore, 'task_participants'),
        where('taskId', '==', task.id)
      );
      const participantSnapshot = await getDocs(participantQuery);
      const participantBatch = writeBatch(firestore);
      const otherHelpers = new Set<string>();

      participantSnapshot.forEach((participantDoc) => {
        const participantRef = doc(firestore, 'task_participants', participantDoc.id);
        const participantData = participantDoc.data() as { helperId?: string };

        if (participantData.helperId === offer.helperId) {
          participantBatch.update(participantRef, { status: 'SELECTED' });
        } else {
          participantBatch.update(participantRef, { status: 'NOT_SELECTED' });
          if (participantData.helperId) {
            otherHelpers.add(participantData.helperId);
          }
        }
      });

      if (!participantSnapshot.empty) {
        await participantBatch.commit();
      }

      const winnerMessage = '🎉 Congratulations! You have been selected to complete this task. Please prepare to get started.';
      await notifyHelper(offer.helperId, winnerMessage);

      const consolationMessage = 'Thank you for your offer—another helper was selected for this task.';
      if (otherHelpers.size > 0) {
        await Promise.all(
          Array.from(otherHelpers).map((helperId) => notifyHelper(helperId, consolationMessage))
        );
      }

      onAccept();

      toast({
        title: 'Offer Accepted!',
        description: `You have assigned ${helper.fullName} to this task.`,
      });
    } catch (error) {
      console.error('Failed to accept offer', error);
      toast({
        variant: 'destructive',
        title: 'Could not accept offer',
        description: 'Please try again or refresh the page.',
      });
    } finally {
      setIsAccepting(false);
    }
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
                 <Separator className="my-4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-1/3 mt-3" />
            </CardContent>
        </Card>
    )
  }

  if (!helper) return null;

  const etaDate = offer.etaAt?.toDate?.();
  const etaLabel = etaDate ? format(etaDate, 'PPP, p') : 'ETA unavailable';

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
                  <span>{helper.stats.ratingAvg?.toFixed(1) || 'New'}</span>
                </div>
                <span>&middot;</span>
                <div>{helper.stats.jobsCompleted || 0} tasks completed</div>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-primary">{`TZS ${offer.price.toLocaleString()}`}</div>
            <div className="text-xs text-muted-foreground">Offered Price</div>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">{offer.message}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-3">
          <AlarmClock className="h-4 w-4 mr-2" />
          <span>Promised ETA: {etaLabel}</span>
        </div>
        <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" asChild>
                <Link href={`/profile/${helper.id}`} target="_blank">View Profile</Link>
            </Button>
            {task.status === 'OPEN' && (
              <Button onClick={handleAcceptOffer} disabled={isAccepting}>
                {isAccepting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning…
                  </span>
                ) : (
                  'Accept Offer'
                )}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
