'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { collection, query, where, doc } from 'firebase/firestore';

import { useUserRole } from '@/context/user-role-context';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import type { Offer, Task } from '@/lib/data';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function getStatusVariant(status: Offer['status']) {
  switch (status) {
    case 'ACCEPTED':
      return 'default' as const;
    case 'REJECTED':
      return 'destructive' as const;
    case 'WITHDRAWN':
      return 'outline' as const;
    default:
      return 'secondary' as const;
  }
}

function OfferRow({ offer, helperId }: { offer: Offer; helperId: string }) {
  const firestore = useFirestore();
  const taskRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'tasks', offer.taskId) : null),
    [firestore, offer.taskId],
  );
  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const submittedAt = offer.createdAt?.toDate
    ? format(offer.createdAt.toDate(), 'dd MMM yyyy, p')
    : 'Pending';
  const threadId = `${offer.taskId}_${helperId}`;

  return (
    <TableRow>
      <TableCell>
        {isTaskLoading ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ) : (
          <div>
            <div className="font-medium">{task?.title ?? 'Task no longer available'}</div>
            <div className="hidden text-sm text-muted-foreground md:block">
              {task?.area ?? 'Area unknown'}
            </div>
          </div>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">{submittedAt}</TableCell>
      <TableCell>
        <Badge className="capitalize" variant={getStatusVariant(offer.status)}>
          {offer.status.toLowerCase()}
        </Badge>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {offer.message ? (
          <span className="line-clamp-2 text-sm text-muted-foreground">{offer.message}</span>
        ) : (
          <span className="text-sm text-muted-foreground">No message</span>
        )}
      </TableCell>
      <TableCell className="text-right font-semibold text-primary">
        TZS {offer.price.toLocaleString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/tasks/${offer.taskId}`}>
              View Task <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/inbox/${threadId}`}>
              Open Chat <MessageCircle className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function OfferRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-24 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-[130px] ml-auto" />
      </TableCell>
    </TableRow>
  );
}

export default function MyOffersPage() {
  const { role, isRoleLoading, hasHelperProfile, setRole } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  const offersQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'offers'), where('helperId', '==', authUser.uid));
  }, [firestore, authUser]);

  const {
    data: offers,
    isLoading: areOffersLoading,
    error: offersError,
  } = useCollection<Offer>(offersQuery);

  const sortedOffers = useMemo(() => {
    if (!offers) return null;
    return [...offers].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });
  }, [offers]);

  const countsByStatus = useMemo(() => {
    return (sortedOffers ?? []).reduce(
      (acc, offer) => {
        acc.total += 1;
        acc.byStatus[offer.status] = (acc.byStatus[offer.status] ?? 0) + 1;
        return acc;
      },
      {
        total: 0,
        byStatus: {
          SUBMITTED: 0,
          ACCEPTED: 0,
          REJECTED: 0,
          WITHDRAWN: 0,
        } as Record<Offer['status'], number>,
      },
    );
  }, [sortedOffers]);

  const isLoading = isUserLoading || areOffersLoading;

  if (isRoleLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we load your account role.</p>
        </CardContent>
      </Card>
    );
  }

  if (!role) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Choose how you want to use tasKey to view offer activity.
          </p>
          {hasHelperProfile && (
            <Button onClick={() => setRole('helper')}>Continue as Helper</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (role === 'customer') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This page is only available to helpers.</p>
          {hasHelperProfile && (
            <Button onClick={() => setRole('helper')}>Switch to helper view</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!authUser && !isUserLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You need to be signed in as a helper to view your submitted offers.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-2xl font-bold">My Offers</h1>
        <p className="text-muted-foreground text-sm">
          Track every offer you have submitted, see their status, and jump back into the conversation when needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your offer activity at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Offers</p>
              <p className="text-2xl font-bold">{countsByStatus?.total ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{countsByStatus?.byStatus.ACCEPTED ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Awaiting Response</p>
              <p className="text-2xl font-bold text-primary">{countsByStatus?.byStatus.SUBMITTED ?? 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Declined / Withdrawn</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {(countsByStatus?.byStatus.REJECTED ?? 0) + (countsByStatus?.byStatus.WITHDRAWN ?? 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offer History</CardTitle>
          <CardDescription>Stay on top of follow-ups and status changes.</CardDescription>
        </CardHeader>
        <CardContent>
          {offersError && (
            <div className="mb-4 rounded border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load offers. Please check your permissions or try again later.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Message</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, index) => <OfferRowSkeleton key={index} />)}
              {!isLoading && authUser && sortedOffers && sortedOffers.length > 0 ? (
                sortedOffers.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} helperId={authUser.uid} />
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      You have not submitted any offers yet. Start by browsing available tasks.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
