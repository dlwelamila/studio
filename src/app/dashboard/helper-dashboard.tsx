'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ListFilter,
  Search,
  Star,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  Shield,
  Briefcase,
  Wrench,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Helper } from '@/lib/data';
import { taskCategories } from '@/lib/data';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function HelperDashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const helperRef = useMemoFirebase(() => authUser && firestore ? doc(firestore, 'helpers', authUser.uid) : null, [authUser, firestore]);
  const { data: helper, isLoading: isHelperLoading } = useDoc<Helper>(helperRef);

  const tasksQuery = useMemoFirebase(() => firestore && authUser ? query(collection(firestore, 'tasks'), where('status', '==', 'OPEN')) : null, [firestore, authUser]);
  const { data: openTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const isLoading = isAuthLoading || areTasksLoading;

  return (
    <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
        <Card>
          {isAuthLoading || isHelperLoading ? (
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          ) : helper ? (
            <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline">{helper.fullName}</CardTitle>
                {helper.verificationStatus === 'Verified' && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                 {helper.isAvailable ? (
                    <ToggleRight className="h-5 w-5 text-green-500" />
                 ) : (
                    <ToggleLeft className="h-5 w-5" />
                 )}
                <span>{helper.isAvailable ? 'Available for tasks' : 'Not available'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                 <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Reliability</span>
                  <Badge variant="outline">{helper.reliabilityIndicator}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{helper.rating || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed Gigs</span>
                  <span>{helper.completedTasks || 0}</span>
                </div>
              </div>
            </CardContent>
            </>
          ) : (
            <CardContent>
              {authUser ? (
                 <p>Could not load helper profile. You may need to create one.</p>
              ) : (
                <p>Please log in to see your profile.</p>
              )}
             
            </CardContent>
          )}
          <CardFooter>
            <Button className="w-full" asChild>
                <Link href="/dashboard/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
        <div className="flex items-center">
            <h1 className="font-headline text-2xl font-bold">Tasks Near You</h1>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {taskCategories.map(cat => (
                    <DropdownMenuCheckboxItem key={cat} checked>
                    {cat}
                    </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by location..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({length: 3}).map((_, i) => <TaskCardSkeleton key={i} />)}
            {openTasks && openTasks.map(task => {
                return (
                    <Card key={task.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{task.category}</Badge>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(task.createdAt.toDate(), { addSuffix: true })}
                                </div>
                            </div>
                            <CardTitle className="font-headline pt-2">{task.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
                            <Separator className="my-4" />
                             <div className="grid gap-4">
                                <div>
                                    <div className="font-semibold text-foreground text-sm">Budget (TZS)</div>
                                    <div className="text-lg font-bold text-primary">{`${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">{task.area}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                     <div className="flex items-start gap-2">
                                        <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-muted-foreground">Effort</p>
                                            <p className="font-semibold capitalize">{task.effort}</p>
                                        </div>
                                     </div>
                                      <div className="flex items-start gap-2">
                                        <Wrench className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-muted-foreground">Tools</p>
                                            <p className="font-semibold capitalize">{task.toolsRequired || 'None'}</p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href={`/dashboard/tasks/${task.id}`}>
                                    View &amp; Make Offer <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
         {openTasks?.length === 0 && !isLoading && authUser && (
            <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No open tasks right now. Check back soon!</p>
                </CardContent>
            </Card>
         )}
          {!authUser && !isLoading && (
             <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Please log in to browse available tasks.</p>
                </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}


function TaskCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 pt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <Separator className="my-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

    
    