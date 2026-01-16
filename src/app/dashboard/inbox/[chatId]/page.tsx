'use client';

import { use, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';

import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Task, TaskThread, ChatMessage, Helper, Customer } from '@/lib/data';
import { useUserRole } from '@/context/user-role-context';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OfferForm } from './offer-form';

const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty.'),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const { user, isUserLoading } = useUser();
  const { role } = useUserRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canRead = useMemo(() => !!firestore && !!user, [firestore, user]);

  const threadRef = useMemo(() => {
    if (!canRead) return null;
    return doc(firestore!, 'task_threads', chatId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, chatId]);
  const { data: thread, isLoading: isThreadLoading, error: threadError } = useDoc<TaskThread>(threadRef);

  const taskRef = useMemo(() => {
    if (!canRead || !thread?.taskId) return null;
    return doc(firestore!, 'tasks', thread.taskId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, thread?.taskId]);
  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !thread) return null;
    return query(collection(firestore, 'task_threads', chatId, 'messages'), orderBy('createdAt', 'asc'));
  }, [firestore, chatId, thread]);
  const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);

  const otherUserId = useMemo(() => {
    if (!user || !thread) return null;
    return user.uid === thread.customerId ? thread.helperId : thread.customerId;
  }, [user, thread]);

  const otherUserCollection = useMemo(() => role === 'customer' ? 'helpers' : 'customers', [role]);
  
  const otherUserRef = useMemo(() => {
    if (!canRead || !otherUserId) return null;
    return doc(firestore!, otherUserCollection, otherUserId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, otherUserCollection, otherUserId]);
  const { data: otherUser, isLoading: isOtherUserLoading } = useDoc<Helper | Customer>(otherUserRef);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '' },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (data: MessageFormValues) => {
    if (!user || !thread || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.' });
      return;
    }
    const messageData = {
      senderId: user.uid,
      text: data.text,
      createdAt: serverTimestamp(),
      type: 'TEXT',
    };
    const messagesCollection = collection(firestore, 'task_threads', thread.id, 'messages');
    addDocumentNonBlocking(messagesCollection, messageData);

    const threadDocRef = doc(firestore, 'task_threads', thread.id);
    updateDoc(threadDocRef, {
        lastMessagePreview: data.text,
        lastMessageAt: serverTimestamp(),
    });

    form.reset();
  };

  const isLoading = isUserLoading || isThreadLoading || isTaskLoading || areMessagesLoading || isOtherUserLoading;
  
  if (threadError) {
     return (
        <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
             <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You do not have permission to view this conversation.</p>
                    <Button asChild variant="outline" className="mt-4">
                    <Link href="/dashboard/inbox">Back to Inbox</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      {isLoading ? (
        <ChatSkeleton />
      ) : !thread || !task || !otherUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Conversation Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This conversation may no longer exist.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/inbox">Back to Inbox</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_300px]">
          <div className="flex flex-col h-[calc(100vh-10rem)] border rounded-lg">
            <div className="flex items-center p-4 border-b">
              <Button variant="outline" size="icon" className="h-8 w-8 mr-4" asChild>
                  <Link href="/dashboard/inbox"><ChevronLeft className="h-4 w-4" /></Link>
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage src={otherUser.profilePhotoUrl} alt={otherUser.fullName} />
                <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-semibold">{otherUser.fullName}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{task.title}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map(message => (
                <div key={message.id} className={cn('flex items-end gap-2', message.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
                  {message.senderId !== user?.uid && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={otherUser.profilePhotoUrl} alt={otherUser.fullName} />
                       <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                   <div className={cn('max-w-xs md:max-w-md rounded-lg px-4 py-2', message.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                        {message.createdAt ? format(message.createdAt.toDate(), 'p') : ''}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4 bg-background rounded-b-lg">
              <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex items-center gap-2">
                <Input {...form.register('text')} placeholder="Type a message..." autoComplete="off" />
                <Button type="submit" size="icon" disabled={form.formState.isSubmitting}><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </div>
          <div className="grid auto-rows-max items-start gap-4">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.area}</p>
                <Separator className="my-3" />
                <p className="text-sm"><span className="font-semibold">Budget:</span> {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}</p>
                 <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href={`/dashboard/tasks/${task.id}`}>View Full Task Details</Link>
                 </Button>
              </CardContent>
             </Card>
             {role === 'helper' && task.status === 'OPEN' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Make a Formal Offer</CardTitle>
                        <CardDescription>Once you've agreed on terms, submit a formal offer here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full">Make Formal Offer</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Submit Your Offer</DialogTitle>
                                    <DialogDescription>
                                        This will be sent to the customer for acceptance.
                                    </DialogDescription>
                                </DialogHeader>
                                <OfferForm task={task} />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        <Card className="h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex items-center p-4 border-b">
                <Skeleton className="h-8 w-8 mr-4 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-10 w-1/2 ml-auto" />
                <Skeleton className="h-16 w-2/3" />
            </div>
            <div className="border-t p-4">
                <Skeleton className="h-10 w-full" />
            </div>
        </Card>
        <div className="space-y-4">
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
        </div>
    </div>
  )
}
