'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star, AlertTriangle, Briefcase, Wrench, CircleX, UserCheck, Clock, CheckCircle, MessagesSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';


import { useUserRole } from '@/context/user-role-context';
import { useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { doc, collection, query, where, GeoPoint } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { OfferCard } from './offer-card';
import { RecommendedHelpers } from './recommended-helpers';
import type { Task, Offer, Customer, Helper, Feedback, TaskParticipant } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ReviewForm } from './review-form';
import { FitIndicator } from './fit-indicator';
import { useHelperJourney } from '@/hooks/use-helper-journey';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TaskEvidence } from './task-evidence';
import { ArrivalCheckIn } from './arrival-check-in';
import { Progress } from '@/components/ui/progress';


export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id: taskId } = use(params);
  const { role } = useUserRole();
  const { user: currentUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [reportMessage, setReportMessage] = useState('');

  const taskRef = useMemoFirebase(() => firestore && doc(firestore, 'tasks', taskId), [firestore, taskId]);
  const { data: task, isLoading: isTaskLoading, error, mutate: mutateTask } = useDoc<Task>(taskRef);

  const customerRef = useMemoFirebase(() => firestore && task && doc(firestore, 'customers', task.customerId), [firestore, task]);
  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);

  const assignedHelperRef = useMemoFirebase(() => firestore && task?.assignedHelperId && doc(firestore, 'helpers', task.assignedHelperId), [firestore, task]);
  const { data: assignedHelper } = useDoc<Helper>(assignedHelperRef);

  const helperProfileRef = useMemoFirebase(() => firestore && currentUser ? doc(firestore, 'helpers', currentUser.uid) : null, [firestore, currentUser]);
  const { data: currentHelperProfile } = useDoc<Helper>(helperProfileRef);
  const journey = useHelperJourney(currentHelperProfile);

  const participantRef = useMemoFirebase(() => firestore && currentUser && doc(firestore, 'task_participants', `${taskId}_${currentUser.uid}`), [firestore, taskId, currentUser]);
  const { data: participant } = useDoc<TaskParticipant>(participantRef);

  const offersQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'tasks', taskId, 'offers')), [firestore, taskId]);
  const { data: offers, isLoading: isOffersLoading, error: offersError } = useCollection<Offer>(offersQuery);

  const feedbacksQuery = useMemoFirebase(() => firestore && task ? query(collection(firestore, 'feedbacks'), where('taskId', '==', task.id)) : null, [firestore, task]);
  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);

  const taskChecklist = useMemo(() => task?.description.split('\n').filter(line => line.trim() !== '' && line.trim().startsWith('- ')) || [], [task?.description]);
  const completedItems = useMemo(() => task?.completedItems || [], [task]);
  const isChecklistComplete = useMemo(() => taskChecklist.length > 0 && completedItems.length === taskChecklist.length, [taskChecklist, completedItems]);
  const checklistProgress = useMemo(() => taskChecklist.length > 0 ? (completedItems.length / taskChecklist.length) * 100 : 0, [taskChecklist, completedItems]);


  const isCustomerView = role === 'customer';
  const isAssignedHelperView = currentUser?.uid === task?.assignedHelperId;
  const hasParticipated = !!participant;
  const hasReviewed = (feedbacks?.length ?? 0) > 0;
  
  const canShowFitIndicator = !isCustomerView && !isAssignedHelperView && currentHelperProfile && task?.status === 'OPEN';
  
  const handleParticipate = () => {
    if (!currentUser || !task || !participantRef || !firestore) return;
    
    const threadRef = doc(firestore, 'task_threads', `${task.id}_${currentUser.uid}`);
    
    // Create participant document
    const participantData = {
        id: participantRef.id,
        taskId: task.id,
        customerId: task.customerId,
        helperId: currentUser.uid,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
    };
    setDocumentNonBlocking(participantRef, participantData);
    
    // Create thread document
    const threadData = {
        id: threadRef.id,
        taskId: task.id,
        customerId: task.customerId,
        helperId: currentUser.uid,
        members: [task.customerId, currentUser.uid],
        createdAt: serverTimestamp(),
        lastMessagePreview: 'You have joined the conversation.',
        lastMessageAt: serverTimestamp(),
    };
    setDocumentNonBlocking(threadRef, threadData);

    toast({ title: 'You are now participating!', description: 'You can now chat with the customer in your inbox.' });
  }

  const handleAcceptSuccess = () => {
    mutateTask();
  };
  
  const handleChecklistItemToggle = (item: string, isChecked: boolean) => {
    if (!taskRef) return;
    const updateData = {
        completedItems: isChecked ? arrayUnion(item) : arrayRemove(item)
    };
    updateDocumentNonBlocking(taskRef, updateData);
    mutateTask();
  };

  const handleStatusUpdate = (newStatus: 'ACTIVE' | 'COMPLETED' | 'IN_DISPUTE') => {
    if (!taskRef) return;
    
    let updateData: any = { status: newStatus };
    if (newStatus === 'COMPLETED') {
      updateData.completedAt = serverTimestamp();
    }
    if (newStatus === 'ACTIVE') {
      updateData.startedAt = serverTimestamp();
    }
    if (newStatus === 'IN_DISPUTE') {
        updateData.disputedAt = serverTimestamp();
    }
  
    updateDocumentNonBlocking(taskRef, updateData);
  
    mutateTask();
    toast({
      title: 'Task Status Updated',
      description: `Task marked as ${newStatus.toLowerCase().replace('_', ' ')}.`,
    });
  };

  const handleReportSubmit = () => {
    if (!currentUser || !firestore || !task) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a ticket.' });
      return;
    }
    if (reportMessage.length < 20) {
        toast({ variant: 'destructive', title: 'Message too short', description: 'Please provide more details about the issue.' });
        return;
    }

    const ticketData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      subject: `Issue with Task: ${task.title} (${task.id})`,
      message: reportMessage,
      status: 'NEW',
      createdAt: serverTimestamp(),
    };

    const ticketsCollection = collection(firestore, 'support_tickets');
    addDocumentNonBlocking(ticketsCollection, ticketData);
    
    toast({ title: 'Support Ticket Submitted', description: "We've received your report and will look into it." });
    setReportMessage('');
  };
  
  if (isTaskLoading || isUserLoading) {
    return <TaskDetailSkeleton />;
  }

  if (!task || error) {
    return (
      <div>
        <h1 className="font-headline text-2xl font-bold">Task not found</h1>
        <p className="text-muted-foreground my-4">This task may have been removed or you do not have permission to view it.</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  const participateButton = () => {
      if (hasParticipated) {
          return (
              <Button className="w-full" asChild>
                  <Link href={`/dashboard/inbox/${task.id}_${currentUser?.uid}`}>Open Chat</Link>
              </Button>
          )
      }
      return (
          <Button onClick={handleParticipate} className="w-full">
              Click here to Participate
          </Button>
      )
  };


  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={isCustomerView ? "/dashboard" : "/dashboard/browse"}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            {isAssignedHelperView ? 'Gig Details' : 'Task Details'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Task ID: {task.id}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          
          {canShowFitIndicator && task && <FitIndicator task={task} />}
          
          {isAssignedHelperView && task.status === 'ASSIGNED' && taskRef && (
             <ArrivalCheckIn task={task} taskRef={taskRef} mutateTask={mutateTask} />
          )}

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
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>

              {taskChecklist.length > 0 && (
                <div className="space-y-4 mt-6">
                    <h3 className="font-headline text-base font-semibold">Task Checklist</h3>
                    {isAssignedHelperView && (
                        <div className="space-y-2">
                            <Progress value={checklistProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-right">{completedItems.length} of {taskChecklist.length} items completed</p>
                        </div>
                    )}
                    <div className="grid gap-2">
                        {taskChecklist.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 rounded-md border p-3">
                                <Checkbox 
                                    id={`check-${index}`} 
                                    disabled={!isAssignedHelperView || task.status !== 'ACTIVE'}
                                    checked={completedItems.includes(item)}
                                    onCheckedChange={(checked) => handleChecklistItemToggle(item, !!checked)}
                                />
                                <Label htmlFor={`check-${index}`} className="text-sm text-foreground">
                                    {item.substring(1).trim()}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
              )}
              
              <Separator className="my-6" />
               <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                    <div className="font-semibold text-foreground">Budget</div>
                    <div className="text-primary font-bold text-lg">
                        {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                    </div>
                </div>
                 <div className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold text-foreground">Effort</p>
                        <p className="capitalize text-muted-foreground">{task.effort}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold text-foreground">Due Date</p>
                        <p className="capitalize text-muted-foreground">{task.dueAt ? format(task.dueAt.toDate(), 'PPP, p') : 'Flexible'}</p>
                    </div>
                 </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold text-foreground">Tools Expected</p>
                        <p className="capitalize text-muted-foreground">{task.toolsRequired?.join(', ') || 'None'}</p>
                    </div>
                 </div>
               </div>
               <Separator className="my-6" />
                <div>
                  <h3 className="font-headline text-base font-semibold mb-4">Task Timeline</h3>
                  <div className="grid gap-4 text-sm sm:grid-cols-3">
                    <div className="grid gap-1">
                      <div className="font-medium text-muted-foreground">Posted</div>
                      <div className="text-foreground">{task.createdAt ? format(task.createdAt.toDate(), 'MMM d, yyyy, h:mm a') : '-'}</div>
                    </div>
                    {task.assignedAt && (
                      <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Assigned</div>
                        <div className="text-foreground">{format(task.assignedAt.toDate(), 'MMM d, yyyy, h:mm a')}</div>
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Completed</div>
                        <div className="text-foreground">{format(task.completedAt.toDate(), 'MMM d, yyyy, h:mm a')}</div>
                      </div>
                    )}
                  </div>
                </div>
                {assignedHelper && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="font-headline text-base font-semibold mb-4">Assigned Helper</h3>
                       <div className="flex items-center gap-4">
                          <Image
                              alt="Helper avatar"
                              className="rounded-full"
                              height={40}
                              src={assignedHelper.profilePhotoUrl || ''}
                              style={{ aspectRatio: '40/40', objectFit: 'cover' }}
                              width={40}
                          />
                          <div>
                              <div className="font-semibold">{assignedHelper.fullName}</div>
                          </div>
                      </div>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
          
          {isAssignedHelperView && <TaskEvidence task={task} />}
          
          {isCustomerView ? (
            <>
                {task.status === 'COMPLETED' && !hasReviewed && assignedHelper && !areFeedbacksLoading && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Confirm Completion</CardTitle>
                            <CardDescription>Review the work and either confirm completion or mark it as incomplete if you are not satisfied.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <ReviewForm task={task} helper={assignedHelper} />
                            <Button variant="outline" className="gap-2" onClick={() => handleStatusUpdate('IN_DISPUTE')}>
                                <CircleX /> Mark as Incomplete
                            </Button>
                        </CardContent>
                    </Card>
                )}
                 {task.status === 'COMPLETED' && hasReviewed && !areFeedbacksLoading && (
                    <Card>
                        <CardHeader>
                            <CardTitle className='font-headline'>Review Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">Thank you for leaving a review!</p>
                        </CardContent>
                    </Card>
                 )}
                 {task.status === 'IN_DISPUTE' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-destructive">Task in Dispute</CardTitle>
                            <CardDescription>
                                You have marked this task as incomplete. Our support team will review this and get in touch with you and the helper to resolve the issue.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                 )}

                <RecommendedHelpers task={task} />
            </>
          ) : isAssignedHelperView ? (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Helper Actions</CardTitle>
                    <CardDescription>Manage the status of this gig.</CardDescription>
                </CardHeader>
                <CardContent>
                    {task.status === 'ASSIGNED' && (
                        <p className="text-center text-sm text-muted-foreground">Check-in upon arrival to begin the task.</p>
                    )}
                    {task.status === 'ACTIVE' && (
                         <Button className="w-full" onClick={() => handleStatusUpdate('COMPLETED')} disabled={!isChecklistComplete}>
                            Mark as Complete
                        </Button>
                    )}
                     {!isChecklistComplete && task.status === 'ACTIVE' && (
                        <p className="text-xs text-center text-muted-foreground mt-2">You must complete all checklist items before marking the task as complete.</p>
                     )}
                    {task.status === 'COMPLETED' && (
                        <p className="text-center text-sm text-muted-foreground">This task is complete. Awaiting customer review.</p>
                    )}
                     {task.status === 'IN_DISPUTE' && (
                        <p className="text-center text-sm text-destructive">The customer has disputed this task's completion. Awaiting review.</p>
                    )}
                     {task.status === 'CANCELLED' && (
                        <p className="text-center text-sm text-muted-foreground">This task was cancelled.</p>
                    )}
                </CardContent>
             </Card>
          ) : (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Participate</CardTitle>
                    <CardDescription>Express interest and ask the customer questions before making a formal offer.</CardDescription>
                </CardHeader>
                <CardFooter>
                    {participateButton()}
                </CardFooter>
            </Card>
          )}

        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{isAssignedHelperView ? 'Customer' : 'Posted by'}</CardTitle>
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
          
          {task.disputedAt && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-base text-destructive">Dispute Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Disputed On</div>
                        <div className="font-medium text-destructive">{format(task.disputedAt.toDate(), 'MMM d, yyyy, p')}</div>
                    </div>
                </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-base">Safety &amp; Support</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report a Problem
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report an Issue</AlertDialogTitle>
                    <AlertDialogDescription>
                      Describe the problem you're experiencing with this task or user. Your report will be sent to our support team for review. This is confidential.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea 
                      placeholder="Please provide as much detail as possible..." 
                      className="min-h-[120px]" 
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleReportSubmit}>Submit Report</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
