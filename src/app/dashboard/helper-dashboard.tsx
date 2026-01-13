'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  ListFilter,
  Search,
  Star,
  BadgeCheck,
  Shield,
  Briefcase,
  Wrench,
  Wallet,
  Percent,
} from 'lucide-react';
import { formatDistanceToNow, isToday, isWeekend, sub, isAfter } from 'date-fns';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, where, doc, Timestamp } from 'firebase/firestore';
import type { Task, Helper } from '@/lib/data';
import { taskCategories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useHelperJourney } from '@/hooks/use-helper-journey';

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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HelperJourneyBanner } from './helper-journey-banner';

type TimeWindowFilter = 'all' | 'today' | 'weekend';

type CalculatedEarnings = {
    thisWeek: number;
    thisMonth: number;
    lifetime: number;
}

const calculateTaskScore = (task: Task, helper: Helper | null): number => {
    if (!helper) return 0;

    let score = 0;
    const twoHoursAgo = sub(new Date(), { hours: 2 });

    // +30 if task category matches helper skills
    if (helper.serviceCategories.includes(task.category)) {
        score += 30;
    }

    // +20 if task area is one the helper services
    if (helper.serviceAreas.some(area => task.area.toLowerCase().includes(area.toLowerCase()))) {
        score += 20;
    }
    
    // +10 if task is recent (< 2 hrs)
    if (task.createdAt && isAfter(task.createdAt.toDate(), twoHoursAgo)) {
        score += 10;
    }

    // Other scoring logic like availability can be added here
    return score;
}


export default function HelperDashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [areaSearch, setAreaSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeWindowFilter>('all');
  const [earnings, setEarnings] = useState<CalculatedEarnings>({ thisWeek: 0, thisMonth: 0, lifetime: 0 });

  const helperRef = useMemoFirebase(() => authUser && firestore ? doc(firestore, 'helpers', authUser.uid) : null, [authUser, firestore]);
  const { data: helper, isLoading: isHelperLoading, mutate: mutateHelper } = useDoc<Helper>(helperRef);
  const journey = useHelperJourney(helper);

  const openTasksQuery = useMemoFirebase(() => firestore && authUser ? query(collection(firestore, 'tasks'), where('status', '==', 'OPEN')) : null, [firestore, authUser]);
  const { data: openTasks, isLoading: areOpenTasksLoading } = useCollection<Task>(openTasksQuery);

  const completedTasksQuery = useMemoFirebase(() => firestore && authUser ? query(collection(firestore, 'tasks'), where('assignedHelperId', '==', authUser.uid), where('status', '==', 'COMPLETED')) : null, [firestore, authUser]);
  const { data: completedTasks, isLoading: areCompletedTasksLoading } = useCollection<Task>(completedTasksQuery);
  
  useEffect(() => {
    if (completedTasks) {
        const now = new Date();
        const oneWeekAgo = sub(now, {days: 7});
        const oneMonthAgo = sub(now, {months: 1});

        const newEarnings: CalculatedEarnings = {
            thisWeek: 0,
            thisMonth: 0,
            lifetime: 0,
        };

        completedTasks.forEach(task => {
            const price = task.acceptedOfferPrice ?? 0;
            newEarnings.lifetime += price;
            
            if (task.completedAt && task.completedAt.toDate() > oneMonthAgo) {
                newEarnings.thisMonth += price;
            }
            if (task.completedAt && task.completedAt.toDate() > oneWeekAgo) {
                newEarnings.thisWeek += price;
            }
        });

        setEarnings(newEarnings);
    }
  }, [completedTasks]);

  const isLoading = isAuthLoading || isHelperLoading || areOpenTasksLoading || areCompletedTasksLoading;

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    if (!helperRef) return;
    // Optimistically update the UI
    mutateHelper();
    // Update the document in the background
    updateDocumentNonBlocking(helperRef, { isAvailable });
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };
  
  const getDistanceToNow = (date: any) => {
    if (!date) return '';
    return formatDistanceToNow(date.toDate(), { addSuffix: true });
  }

  const filteredAndScoredTasks = useMemo(() => {
    if (!openTasks) return [];
    
    return openTasks
        .filter(task => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(task.category);
            const areaMatch = areaSearch === '' || task.area.toLowerCase().includes(areaSearch.toLowerCase());
            
            const timeMatch = (() => {
                if (timeFilter === 'all') return true;
                const createdAt = task.createdAt instanceof Timestamp ? task.createdAt.toDate() : new Date();
                if (timeFilter === 'today') return isToday(createdAt);
                if (timeFilter === 'weekend') return isWeekend(createdAt);
                return true;
            })();

            return categoryMatch && areaMatch && timeMatch;
        })
        .map(task => ({
            ...task,
            score: calculateTaskScore(task, helper)
        }))
        .sort((a, b) => b.score - a.score); // Sort by score descending

  }, [openTasks, selectedCategories, areaSearch, timeFilter, helper]);


  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      
      {helper && <HelperJourneyBanner helper={helper} />}

      <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
          <Card>
            {isAuthLoading || isHelperLoading || !journey ? (
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            ) : helper ? (
              <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline">{helper.fullName}</CardTitle>
                  {helper.verificationStatus === 'APPROVED' && (
                    <Badge variant="secondary" className="gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Switch 
                    id="availability-toggle" 
                    checked={helper.isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                    aria-readonly
                  />
                  <Label 
                    htmlFor="availability-toggle" 
                    className={cn(
                        "text-sm",
                        !helper.isAvailable ? "text-destructive font-bold" : "text-muted-foreground"
                    )}
                  >
                    {helper.isAvailable ? 'Available for tasks' : 'Not available'}
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 text-sm">
                    <Separator />
                    <CardTitle className='font-headline text-base'>Stats At-a-Glance</CardTitle>
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4" /> Rating</span>
                        <span className="font-semibold">{journey.stats.ratingAvg?.toFixed(1) || 'N/A'} / 5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" /> Reliability</span>
                        <Badge 
                            variant="outline"
                            className={cn(
                                journey.stats.reliabilityLevel === 'GREEN' && "text-green-700 border-green-700/50",
                                journey.stats.reliabilityLevel === 'YELLOW' && "text-yellow-600 border-yellow-600/50",
                                journey.stats.reliabilityLevel === 'RED' && "text-destructive border-destructive/50",
                            )}
                        >
                            {journey.stats.reliabilityLevel}
                        </Badge>
                  </div>
                   <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground"><Percent className="h-4 w-4" /> Completion Rate</span>
                        <span className="font-semibold">{(journey.stats.completionRate * 100).toFixed(0)}%</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" /> Completed Gigs</span>
                    <span className="font-semibold">{journey.stats.jobsCompleted || 0}</span>
                  </div>
                </div>
              </CardContent>
              </>
            ) : (
              <CardContent className="py-6">
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

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span>Earnings Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Separator />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div>
                    <CardDescription>This Week</CardDescription>
                    <p className="text-2xl font-bold">{earnings.thisWeek.toLocaleString()} TZS</p>
                  </div>
                  <Separator />
                   <div>
                    <CardDescription>This Month</CardDescription>
                    <p className="text-2xl font-bold">{earnings.thisMonth.toLocaleString()} TZS</p>
                  </div>
                   <Separator />
                   <div>
                    <CardDescription>Lifetime</CardDescription>
                    <p className="text-2xl font-bold">{earnings.lifetime.toLocaleString()} TZS</p>
                  </div>
                </>
              )}
            </CardContent>
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
                      <DropdownMenuCheckboxItem 
                        key={cat} 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => handleCategoryChange(cat, !!checked)}
                      >
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
                  value={areaSearch}
                  onChange={(e) => setAreaSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Time:</span>
            <Button variant={timeFilter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTimeFilter('all')}>All Time</Button>
            <Button variant={timeFilter === 'today' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTimeFilter('today')}>Today</Button>
            <Button variant={timeFilter === 'weekend' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTimeFilter('weekend')}>This Weekend</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
              {isLoading && Array.from({length: 2}).map((_, i) => <TaskCardSkeleton key={i} />)}
              {filteredAndScoredTasks && filteredAndScoredTasks.map(task => {
                  return (
                      <Card key={task.id} className="flex flex-col">
                          <CardHeader>
                              <div className="flex justify-between items-start">
                                  <Badge variant="outline">{task.category}</Badge>
                                  <div className="text-xs text-muted-foreground">
                                      {getDistanceToNow(task.createdAt)}
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
                                              <p className="font-semibold capitalize">{task.toolsRequired?.join(', ') || 'None'}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </CardContent>
                          <CardFooter>
                              <Button className="w-full" asChild>
                                  <Link href={`/dashboard/tasks/${task.id}`}>
                                      View & Make Offer <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                              </Button>
                          </CardFooter>
                      </Card>
                  )
              })}
          </div>
          {filteredAndScoredTasks?.length === 0 && !isLoading && authUser && (
              <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No open tasks match your filters. Try widening your search!</p>
                  </CardContent>
              </Card>
          )}
            {!authUser && !isLoading && (
              <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">Please log in to browse available tasks.</p>
                  </CardContent>
              </Card>
            )}
        </div>
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
    