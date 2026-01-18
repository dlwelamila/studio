'use client';

import { useState, useEffect } from 'react';
import { serverTimestamp, DocumentReference, Timestamp } from 'firebase/firestore';
import { Loader, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Task, Offer } from '@/lib/data';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTimer } from 'react-timer-hook';
import { useUserRole } from '@/context/user-role-context';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';

type ArrivalCheckInProps = {
  task: Task;
  taskRef: DocumentReference;
  mutateTask: () => void;
};

function formatDuration(totalSeconds: number) {
  const clamped = Math.max(totalSeconds, 0);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Countdown({
  expiryTimestamp,
  onExpire,
  label,
}: {
  expiryTimestamp: Date;
  onExpire?: () => void;
  label: string;
}) {
  const { seconds, minutes, hours } = useTimer({ expiryTimestamp, onExpire });

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-mono text-2xl font-bold text-primary">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
}

export function ArrivalCheckIn({ task, taskRef, mutateTask }: ArrivalCheckInProps) {
  const { toast } = useToast();
  const { role } = useUserRole();
  const firestore = useFirestore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequestingLateStart, setIsRequestingLateStart] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const offersQuery = useMemoFirebase(() => {
    if (!firestore || !task.acceptedOfferId) return null;
    return query(collection(firestore, 'tasks', task.id, 'offers'), where('__name__', '==', task.acceptedOfferId));
  }, [firestore, task.id, task.acceptedOfferId]);

  const { data: offers } = useCollection<Offer>(offersQuery);
  const acceptedOffer = offers?.[0];
  const eta = acceptedOffer?.etaAt.toDate();
  const checkInWindowEnd = eta ? new Date(eta.getTime() + 30 * 60000) : null;
  const hasHelperCheckedIn = !!task.helperCheckInTime;
  const isBeforeEta = !!eta && now < eta;
  const isWindowExpired = !hasHelperCheckedIn && !!checkInWindowEnd && now > checkInWindowEnd;
  const isWindowOpen = !hasHelperCheckedIn && !!eta && !isWindowExpired && now >= eta;
  const windowSecondsRemaining = isWindowOpen && checkInWindowEnd ? Math.max(0, Math.floor((checkInWindowEnd.getTime() - now.getTime()) / 1000)) : 0;
  const lateSecondsElapsed = isWindowExpired && checkInWindowEnd ? Math.max(0, Math.floor((now.getTime() - checkInWindowEnd.getTime()) / 1000)) : 0;
  const recordedLateSeconds = task.lateStartSeconds ?? null;
  const isLateRequestPending = task.lateStartStatus === 'REQUESTED';

  const handleCheckIn = () => {
    if (!eta || !checkInWindowEnd) {
        setError('The ETA for this task is not set.');
        return;
    }

    const currentTime = new Date();
    if (currentTime > checkInWindowEnd) {
        setError('The 30-minute check-in window has passed. You can no longer check in for this task.');
        // Optionally, flag helper as late in the database
        return;
    }
    setError(null);
    setIsLoading(true);
    updateDocumentNonBlocking(taskRef, { helperCheckInTime: serverTimestamp() });
    mutateTask();
    setIsLoading(false);
    toast({
        title: 'Check-in initiated!',
        description: 'The customer has been notified to confirm your arrival.'
    });
  };
  
  const handleLateStart = async () => {
    if (!firestore || !taskRef || !task.assignedHelperId || !task.customerId || isLateRequestPending) return;

    setIsRequestingLateStart(true);
    const latePayload: Record<string, any> = {
      lateStartRequestedAt: serverTimestamp(),
      lateStartSeconds: lateSecondsElapsed,
      lateStartStatus: 'REQUESTED',
    };

    try {
      await updateDocumentNonBlocking(taskRef, latePayload);
      mutateTask();

      const threadId = `${task.id}_${task.customerId}_${task.assignedHelperId}`;
      const messagesRef = collection(firestore, 'task_threads', threadId, 'messages');
      addDocumentNonBlocking(messagesRef, {
        senderId: task.assignedHelperId,
        text: 'The helper is running late and has requested approval to start.',
        createdAt: serverTimestamp(),
        type: 'SYSTEM',
        meta: { category: 'LATE_START' },
      });

      const threadRef = doc(firestore, 'task_threads', threadId);
      updateDocumentNonBlocking(threadRef, {
        lastMessagePreview: 'Helper requested a late start approval.',
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: task.assignedHelperId,
      });

      toast({
        title: 'Late start requested',
        description: 'We asked the customer to approve your late arrival before starting.',
      });
    } catch (_) {
      toast({
        variant: 'destructive',
        title: 'Late start request failed',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsRequestingLateStart(false);
    }
  };

   const handleCustomerConfirm = () => {
    const approvalTimestamp = serverTimestamp();
    const updatePayload: Record<string, any> = {
      status: 'ACTIVE',
      checkinConfirmedAt: approvalTimestamp,
      startedAt: approvalTimestamp,
    };

    if (task.helperCheckInTime) {
      updatePayload.arrivedAt = task.helperCheckInTime;
    } else {
      const lateTimestamp = serverTimestamp();
      updatePayload.helperCheckInTime = lateTimestamp;
      updatePayload.arrivedAt = lateTimestamp;
      if (task.lateStartSeconds == null && checkInWindowEnd) {
        const fallbackLateSeconds = Math.max(0, Math.floor((now.getTime() - checkInWindowEnd.getTime()) / 1000));
        updatePayload.lateStartSeconds = fallbackLateSeconds;
      }
    }

    if (task.lateStartStatus === 'REQUESTED') {
      updatePayload.lateStartStatus = 'APPROVED';
      updatePayload.lateStartApprovedAt = approvalTimestamp;
    }

    updateDocumentNonBlocking(taskRef, updatePayload);
    mutateTask();
  };


  if (!acceptedOffer) {
    return <Card><CardContent><p className="p-4 text-center text-muted-foreground">Loading offer details...</p></CardContent></Card>
  }
   if (!eta) {
    return <Card><CardContent><p className="p-4 text-center text-muted-foreground">Offer ETA not found.</p></CardContent></Card>
  }
  
  const isArrivalConfirmed = hasHelperCheckedIn && !!task.checkinConfirmedAt;

  if (hasHelperCheckedIn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Arrival Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                {isArrivalConfirmed ? (
                  <p className="text-muted-foreground">Arrival confirmed. You can begin the task.</p>
                ) : (
                  <>
                    <p className="text-muted-foreground">Waiting for customer to confirm your arrival...</p>
                    {role === 'customer' && (
                      <Button onClick={handleCustomerConfirm} className="mt-4">
                          Confirm Helper Arrival
                      </Button>
                    )}
                  </>
                )}
            </CardContent>
        </Card>
    )
  }

  const isHelperView = role === 'helper';
  const description = isHelperView
    ? 'Check in within 30 minutes of your promised ETA to start the task.'
    : 'Your helper must check in within 30 minutes of their promised arrival (ETA).';
  const countdownLabel = isHelperView
    ? 'Check-in window opens in:'
    : "Helper's check-in window opens in:";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Arrival Check-In</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {error && (
            <Alert variant="destructive" className="mb-4 text-left">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Check-In Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {eta && isBeforeEta && (
            <Countdown
              expiryTimestamp={eta}
              label={countdownLabel}
            />
        )}

        {isWindowOpen && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {isHelperView
                ? `Time left to check in: ${formatDuration(windowSecondsRemaining)}`
                : `Helper must check in within ${formatDuration(windowSecondsRemaining)}.`}
            </p>
            {isHelperView && (
              <Button
                onClick={handleCheckIn}
                disabled={isLoading}
                className={cn(
                  'w-full transition-transform duration-300',
                  !isLoading && 'animate-[pulse_1s_ease-in-out_infinite] ring-2 ring-offset-2 ring-primary/50 shadow-lg shadow-primary/30 hover:scale-[1.02]'
                )}
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Notifying Customer...' : 'Check In & Notify Customer'}
              </Button>
            )}
          </div>
        )}

        {isWindowExpired && !isLateRequestPending && isHelperView && (
          <div className="space-y-3">
            <Alert className="text-left border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Check-in window missed</AlertTitle>
              <AlertDescription>
                You are {formatDuration(lateSecondsElapsed)} past the promised window. Request customer approval to begin.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleLateStart}
              disabled={isRequestingLateStart}
              className={cn(
                'w-full transition-transform duration-300 bg-destructive hover:bg-destructive/90',
                !isRequestingLateStart && 'animate-[pulse_1s_ease-in-out_infinite] ring-2 ring-offset-2 ring-destructive/40 shadow-lg shadow-destructive/30 hover:scale-[1.02]'
              )}
            >
              {isRequestingLateStart && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isRequestingLateStart ? 'Requesting approval...' : "You're late, Click to Start"}
            </Button>
          </div>
        )}

        {isWindowExpired && isLateRequestPending && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Late start requested {formatDuration(recordedLateSeconds ?? lateSecondsElapsed)} ago. Waiting for customer approval.
            </p>
            {role === 'customer' && (
              <Button onClick={handleCustomerConfirm} className="w-full">
                Approve Late Start
              </Button>
            )}
          </div>
        )}

        {isWindowExpired && !isLateRequestPending && role === 'customer' && (
          <p className="text-sm font-semibold text-destructive">
            The helper missed the check-in window {formatDuration(lateSecondsElapsed)} ago. Waiting for them to request a late start.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
