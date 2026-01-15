'use client';

import { useState, useEffect } from 'react';
import { serverTimestamp, DocumentReference } from 'firebase/firestore';
import { Loader, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Task, Offer } from '@/lib/data';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTimer } from 'react-timer-hook';
import { differenceInSeconds, isAfter } from 'date-fns';
import { useUserRole } from '@/context/user-role-context';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

type ArrivalCheckInProps = {
  task: Task;
  taskRef: DocumentReference;
  mutateTask: () => void;
};

function Countdown({ expiryTimestamp, onExpire }: { expiryTimestamp: Date, onExpire: () => void }) {
  const { seconds, minutes, hours } = useTimer({ expiryTimestamp, onExpire });

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">Check-in window opens in:</p>
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

  const offersQuery = useMemoFirebase(() => {
    if (!firestore || !task.acceptedOfferId) return null;
    return query(collection(firestore, 'tasks', task.id, 'offers'), where('__name__', '==', task.acceptedOfferId));
  }, [firestore, task.id, task.acceptedOfferId]);

  const { data: offers } = useCollection<Offer>(offersQuery);
  const acceptedOffer = offers?.[0];
  
  const eta = acceptedOffer?.etaAt.toDate();
  const [isCheckInWindowOpen, setIsCheckInWindowOpen] = useState(eta ? differenceInSeconds(new Date(), eta) >= 0 : false);

  useEffect(() => {
    if (eta && !isCheckInWindowOpen) {
      const now = new Date();
      if (isAfter(now, eta)) {
        setIsCheckInWindowOpen(true);
      }
    }
  }, [eta, isCheckInWindowOpen]);

  const handleCheckIn = () => {
    if (!eta) {
        setError('The ETA for this task is not set.');
        return;
    }

    const now = new Date();
    const thirtyMinutesAfterETA = new Date(eta.getTime() + 30 * 60000);

    if (now > thirtyMinutesAfterETA) {
        setError('The 30-minute check-in window has passed. You can no longer check in for this task.');
        // Optionally, flag helper as late in the database
        return;
    }
    
    setIsLoading(true);
    updateDocumentNonBlocking(taskRef, { helperCheckInTime: serverTimestamp() });
    mutateTask();
    setIsLoading(false);
    toast({
        title: 'Check-in initiated!',
        description: 'The customer has been notified to confirm your arrival.'
    });
  };
  
   const handleCustomerConfirm = () => {
    if (!task.helperCheckInTime) return;
    updateDocumentNonBlocking(taskRef, {
        status: 'ACTIVE',
        customerConfirmationTime: serverTimestamp(),
        arrivedAt: task.helperCheckInTime, 
    });
    mutateTask();
  };


  if (!acceptedOffer) {
    return <Card><CardContent><p className="p-4 text-center text-muted-foreground">Loading offer details...</p></CardContent></Card>
  }
   if (!eta) {
    return <Card><CardContent><p className="p-4 text-center text-muted-foreground">Offer ETA not found.</p></CardContent></Card>
  }
  
  const hasHelperCheckedIn = !!task.helperCheckInTime;
  
  if (hasHelperCheckedIn) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Arrival Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">Waiting for customer to confirm your arrival...</p>
                {role === 'customer' && (
                  <Button onClick={handleCustomerConfirm} className="mt-4">
                      Confirm Helper Arrival
                  </Button>
                )}
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Arrival Check-In</span>
        </CardTitle>
        <CardDescription>
          Check in within 30 minutes of your promised ETA to start the task.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {error && (
            <Alert variant="destructive" className="mb-4 text-left">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Check-In Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {!isCheckInWindowOpen && (
            <Countdown expiryTimestamp={eta} onExpire={() => setIsCheckInWindowOpen(true)} />
        )}

        {isCheckInWindowOpen && role === 'helper' && (
            <Button onClick={handleCheckIn} disabled={isLoading} className="w-full">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Notifying Customer...' : 'Check In & Notify Customer'}
            </Button>
        )}
        
         {isCheckInWindowOpen && role === 'customer' && (
             <p className="text-sm text-muted-foreground">Awaiting helper check-in.</p>
        )}
      </CardContent>
    </Card>
  );
}
