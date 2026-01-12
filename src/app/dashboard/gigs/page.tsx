
'use client';

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
import { useUserRole } from '@/context/user-role-context';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Customer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyGigsPage() {
  const { role } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  const gigsQuery = useMemoFirebase(() => {
    if (!authUser || !firestore) return null;
    return query(
      collection(firestore, 'tasks'),
      where('assignedHelperId', '==', authUser.uid)
    );
  }, [authUser, firestore]);

  const { data: myGigs, isLoading: areGigsLoading } = useCollection<Task>(gigsQuery);

  if (role === 'customer') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is only available to helpers. Please switch to your helper profile to view your gigs.</p>
        </CardContent>
      </Card>
    );
  }

  const isLoading = isUserLoading || areGigsLoading;

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-6">My Gigs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Tasks</CardTitle>
          <CardDescription>
            Here are the tasks that have been assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Completed On</TableHead>
                <TableHead className="text-right">Earnings (TZS)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => <GigRowSkeleton key={i} />)}
              {!isLoading && myGigs && myGigs.length > 0 ? (
                myGigs.map((gig) => (
                  <GigRow key={gig.id} gig={gig} />
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      You have no assigned gigs yet.
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

function GigRow({ gig }: { gig: Task }) {
  const firestore = useFirestore();
  const customerRef = useMemoFirebase(() => firestore ? doc(firestore, 'customers', gig.customerId) : null, [firestore, gig.customerId]);
  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);
  
  const price = gig.acceptedOfferPrice ? gig.acceptedOfferPrice.toLocaleString() : gig.budget.max.toLocaleString();

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{gig.title}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {gig.area}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {isCustomerLoading ? <Skeleton className="h-5 w-24" /> : customer?.fullName}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="capitalize"
          variant={
            gig.status === 'COMPLETED'
              ? 'default'
              : gig.status === 'ASSIGNED' ? 'secondary' : 'outline'
          }
        >
          {gig.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {gig.completedAt ? format(gig.completedAt.toDate(), 'dd MMM yyyy') : 'Pending'}
      </TableCell>
      <TableCell className="text-right">
        {price}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${gig.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function GigRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-20 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-[125px] ml-auto" />
      </TableCell>
    </TableRow>
  );
}
