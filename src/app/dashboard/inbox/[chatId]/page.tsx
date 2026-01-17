'use client';

import { use, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Check, CheckCheck } from 'lucide-react';
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
  increment,
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
  const { role } = useUserRole(); // still used for UI-only behavior (e.g., offer panel), NOT for data access
  const firestore = useFirestore();
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const lastMarkedReadRef = useRef<number>(0);

  // Gate all reads until auth is resolved
  const canRead = useMemo(() => !!firestore && !!user && !isUserLoading, [firestore, user, isUserLoading]);

  const threadRef = useMemo(() => {
    if (!canRead) return null;
    return doc(firestore!, 'task_threads', chatId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, chatId]);

  const { data: thread, isLoading: isThreadLoading, error: threadError } = useDoc<TaskThread>(threadRef);

  const canonicalThreadDocRef = useMemo(() => {
    if (!firestore || !thread?.id) return null;
    return doc(firestore, 'task_threads', thread.id) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [firestore, thread?.id]);

  const taskRef = useMemo(() => {
    if (!canRead || !thread?.taskId) return null;
    return doc(firestore!, 'tasks', thread.taskId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, thread?.taskId]);

  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  // Messages query MUST be based on the thread document (thread.id) not just the route param
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !thread?.id) return null;
    return query(
      collection(firestore, 'task_threads', thread.id, 'messages'),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, thread?.id]);

  const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);

  // Determine who I am in this specific thread (do not trust UI role)
  const mySide = useMemo<'customer' | 'helper' | null>(() => {
    if (!user || !thread) return null;
    if (user.uid === thread.customerId) return 'customer';
    if (user.uid === thread.helperId) return 'helper';
    return null;
  }, [user, thread]);

  const otherUserId = useMemo(() => {
    if (!user || !thread || !mySide) return null;
    return mySide === 'customer' ? thread.helperId : thread.customerId;
  }, [user, thread, mySide]);

  const otherUserCollection = useMemo(() => {
    if (!mySide) return null;
    return mySide === 'customer' ? 'helpers' : 'customers';
  }, [mySide]);

  const otherUserRef = useMemo(() => {
    if (!canRead || !otherUserId || !otherUserCollection) return null;
    return doc(firestore!, otherUserCollection, otherUserId) as unknown as import('firebase/firestore').DocumentReference<DocumentData>;
  }, [canRead, firestore, otherUserCollection, otherUserId]);

  const { data: otherUser, isLoading: isOtherUserLoading } = useDoc<Helper | Customer>(otherUserRef);

  const otherUserIsTyping = useMemo(() => {
    if (!thread || !otherUserId) return false;
    return Boolean(thread.typing?.[otherUserId]);
  }, [otherUserId, thread]);

  const otherUserLastReadAt = useMemo(() => {
    if (!thread || !otherUserId) return null;
    return thread.lastReadAt?.[otherUserId] ?? null;
  }, [otherUserId, thread]);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '' },
  });

  const messageField = form.register('text');

  const markMessagesAsRead = useCallback(() => {
    if (!canonicalThreadDocRef || !user) return;
    const lastReadField = `lastReadAt.${user.uid}`;
    const typingField = `typing.${user.uid}`;
    const unreadField = `unreadCounts.${user.uid}`;
    updateDoc(canonicalThreadDocRef, {
      [lastReadField]: serverTimestamp(),
      [typingField]: false,
      [unreadField]: 0,
    }).catch(() => {});
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [canonicalThreadDocRef, user]);

  const ensureTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (!canonicalThreadDocRef || !user) return;
      const typingField = `typing.${user.uid}`;
      updateDoc(canonicalThreadDocRef, {
        [typingField]: isTyping,
      }).catch(() => {});
    },
    [canonicalThreadDocRef, user]
  );

  const stopTyping = useCallback(() => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    ensureTypingStatus(false);
  }, [ensureTypingStatus]);

  const notifyTyping = useCallback(() => {
    if (!user) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      ensureTypingStatus(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [ensureTypingStatus, stopTyping, user]);

  const getMessageStatus = useCallback(
    (message: ChatMessage) => {
      if (!user) return null;
      if (message.senderId !== user.uid) return null;

      const messageTimestamp = message.createdAt?.toMillis?.();
      if (!messageTimestamp) return 'sent';

      const otherReadTimestamp = otherUserLastReadAt?.toMillis?.();
      if (otherReadTimestamp && otherReadTimestamp >= messageTimestamp) return 'seen';

      return 'received';
    },
    [otherUserLastReadAt, user]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  useEffect(() => () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      ensureTypingStatus(false);
    }
  }, [ensureTypingStatus]);

  useEffect(() => {
    if (!thread || !user || !mySide) return;

    const latestMessageTimestamp = messages?.length
      ? messages[messages.length - 1]?.createdAt?.toMillis?.()
      : thread.lastMessageAt?.toMillis?.();

    if (!latestMessageTimestamp) {
      if (!lastMarkedReadRef.current) {
        markMessagesAsRead();
        lastMarkedReadRef.current = Date.now();
      }
      return;
    }

    if (latestMessageTimestamp <= lastMarkedReadRef.current) return;

    markMessagesAsRead();
    lastMarkedReadRef.current = latestMessageTimestamp;
  }, [markMessagesAsRead, messages, mySide, thread, user]);

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

    if (canonicalThreadDocRef) {
      const senderReadField = `lastReadAt.${user.uid}`;
      const typingField = `typing.${user.uid}`;
      const updatePayload: Record<string, any> = {
        lastMessagePreview: data.text,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: user.uid,
        [senderReadField]: serverTimestamp(),
        [typingField]: false,
      };

      const recipientId =
        user.uid === thread.customerId ? thread.helperId :
        user.uid === thread.helperId ? thread.customerId :
        null;

      if (recipientId) {
        const recipientUnreadField = `unreadCounts.${recipientId}`;
        updatePayload[recipientUnreadField] = increment(1);
      }

      updateDoc(canonicalThreadDocRef, updatePayload).catch(() => {});
    }

    stopTyping();

    form.reset();
  };

  const isLoading =
    isUserLoading || isThreadLoading || isTaskLoading || areMessagesLoading || isOtherUserLoading;

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
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      {isLoading ? (
        <ChatSkeleton />
      ) : !thread || !task || !otherUser || !mySide ? (
        <Card>
          <CardHeader>
            <CardTitle>Conversation Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This conversation may no longer exist, or your role does not match this thread.</p>
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
                <Link href="/dashboard/inbox">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>

              <Avatar className="h-9 w-9">
                <AvatarImage src={otherUser.profilePhotoUrl || ''} alt={otherUser.fullName} />
                <AvatarFallback>{otherUser.fullName?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>

              <div className="ml-4">
                <p className="font-semibold">{otherUser.fullName}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{task.title}</p>
                {otherUserIsTyping && <p className="text-xs text-primary mt-1">Typing...</p>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message) => {
                const isMine = message.senderId === user?.uid;
                const status = getMessageStatus(message);
                const messageDate = message.createdAt?.toDate?.();
                const timestampLabel = messageDate ? format(messageDate, 'p') : '';

                let statusIcon = null;
                if (status === 'sent') {
                  statusIcon = <Check className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
                } else if (status === 'received') {
                  statusIcon = <CheckCheck className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
                } else if (status === 'seen') {
                  statusIcon = <CheckCheck className="h-3 w-3 text-sky-500" aria-hidden="true" />;
                }

                return (
                  <div
                    key={message.id}
                    className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}
                  >
                    {!isMine && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser.profilePhotoUrl || ''} alt={otherUser.fullName} />
                        <AvatarFallback>{otherUser.fullName?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        'max-w-xs md:max-w-md rounded-lg px-4 py-2',
                        isMine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div
                        className={cn(
                          'mt-1 flex items-center gap-1 text-xs opacity-70',
                          isMine ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {timestampLabel && <span>{timestampLabel}</span>}
                        {statusIcon && (
                          <span className="flex items-center gap-1" aria-label={status || undefined}>
                            {statusIcon}
                            <span className="sr-only capitalize">{status}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {otherUserIsTyping && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>{otherUser.fullName?.split(' ')[0] || 'They'} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 bg-background rounded-b-lg">
              <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex items-center gap-2">
                <Input
                  {...messageField}
                  placeholder="Type a message..."
                  autoComplete="off"
                  onChange={(event) => {
                    messageField.onChange(event);
                    notifyTyping();
                  }}
                  onBlur={(event) => {
                    messageField.onBlur(event);
                    stopTyping();
                  }}
                />
                <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
                  <Send className="h-4 w-4" />
                </Button>
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
                <p className="text-sm">
                  <span className="font-semibold">Budget:</span>{' '}
                  {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                </p>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href={`/dashboard/tasks/${task.id}`}>View Full Task Details</Link>
                </Button>
              </CardContent>
            </Card>

            {/* UI-only gating can still use role if you want, but data access must not */}
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
                        <DialogDescription>This will be sent to the customer for acceptance.</DialogDescription>
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
