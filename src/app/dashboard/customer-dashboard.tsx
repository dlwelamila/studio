
'use client';

import Link from 'next/link';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Offer, Helper } from '@/lib/data';

import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerDashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(() => authUser && firestore ? query(collection(firestore, 'tasks'), where('customerId', '==', authUser.uid)) : null, [authUser, firestore]);
  const { data: customerTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const isLoading = isAuthLoading || areTasksLoading;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold">My Tasks</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/tasks/new">
              <PlusCircle className="h-4 w-4" />
              <span className="ml-2">Post New Task</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Your Active and Past Tasks</CardTitle>
          <CardDescription>
            An overview of all the tasks you&apos;ve posted on tasKey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Offers</TableHead>
                <TableHead className="hidden md:table-cell">Completed</TableHead>
                <TableHead className="text-right">Cost (TZS)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({length: 3}).map((_, i) => <TaskRowSkeleton key={i} />)}
              {customerTasks && customerTasks.length > 0 ? (
                customerTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      { authUser ? "You haven't posted any tasks yet." : "Please log in to see your tasks."}
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


function TaskRow({ task }: { task: Task }) {
  const firestore = useFirestore();

  const offersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'tasks', task.id, 'offers')) : null, [firestore, task.id]);
  const { data: taskOffers } = useCollection<Offer>(offersQuery);
  
  const helperRef = useMemoFirebase(() => firestore && task.assignedHelperId ? doc(firestore, 'helpers', task.assignedHelperId) : null, [firestore, task.assignedHelperId]);
  const { data: assignedHelper } = useDoc<Helper>(helperRef);

  const finalCost = task.acceptedOfferPrice 
    ? task.acceptedOfferPrice.toLocaleString() 
    : `${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`;

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{task.title}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {assignedHelper ? `Assigned to ${assignedHelper.fullName}` : task.category}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="capitalize"
          variant={
            task.status === 'OPEN'
              ? 'secondary'
              : task.status === 'COMPLETED'
              ? 'default'
              : 'outline'
          }
        >
          {task.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {taskOffers?.length ?? 0}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {task.completedAt ? format(task.completedAt.toDate(), 'dd MMM yyyy') : 'Pending'}
      </TableCell>
      <TableCell className="text-right">
          {finalCost}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${task.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function TaskRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-8" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-28 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-[125px] ml-auto" />
      </TableCell>
    </TableRow>
  )
}
