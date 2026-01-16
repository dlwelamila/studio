'use client';

import { use, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import {
  doc,
  collection,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ChevronLeft, SendHorizontal } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { TaskThread, ChatMessage, Helper, Customer, Task } from '@/lib/data';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { OfferForm } from './offer-form';

function isTaskChatLocked(task?: Task | null) {
  const s = task?.status;
  return s === 'COMPLETED' || s === 'IN_DISPUTE' || s === 'CANCELLED';
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = use(params);

  const { role } = useUserRole();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canRead = !!firestore && !!user?.uid && !isUserLoading;

  const threadRef = useMemoFirebase(() => {
    if (!canRead) return null;
    return doc(firestore, 'task_threads', chatId);
  }, [canRead, firestore, chatId]);

  const { data: thread, isLoading: isThreadLoading, error: threadError } =
    useDoc<TaskThread>(threadRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!threadRef) return null;
    return query(collection(threadRef, 'messages'), orderBy('createdAt', 'asc'));
  }, [threadRef]);

  const {
    data: messages,
    isLoading: areMessagesLoading,
    error: messagesError,
  } = useCollection<ChatMessage>(messagesQuery);

  const otherUserId = useMemo(() => {
    if (!thread || !user) return null;
    return role === 'customer' ? thread.helperId : thread.customerId;
  }, [thread, user, role]);

  const otherUserCollection = role === 'customer' ? 'helpers' : 'customers';

  const otherUserRef = useMemoFirebase(() => {
    if (!canRead || !otherUserId) return null;
    return doc(firestore, otherUserCollection, otherUserId);
  }, [canRead, firestore, otherUserCollection, otherUserId]);

  const { data: otherUser, isLoading: isOtherUserLoading } =
    useDoc<Helper | Customer>(otherUserRef);

  const taskRef = useMemoFirebase(() => {
    if (!canRead || !thread?.taskId) return null;
    return doc(firestore, 'tasks', thread.taskId);
  }, [canRead, firestore, thread?.taskId]);

  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  // -----------------------------
  // ✅ Read Receipts (thread.lastReadAt[uid] = now)
  // -----------------------------
  const markRead = useCallback(() => {
    if (!threadRef || !user?.uid) return;
    updateDocumentNonBlocking(threadRef, {
      [`lastReadAt.${user.uid}`]: serverTimestamp(),
    });
  }, [threadRef, user?.uid]);

  useEffect(() => {
    if (!threadRef || !user?.uid) return;
    // Mark read when opening
    markRead();

    // Mark read when tab refocus
    const onFocus = () => markRead();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [threadRef, user?.uid, markRead]);

  useEffect(() => {
    // Mark read when new messages arrive
    if ((messages?.length ?? 0) > 0) markRead();
  }, [messages?.length, markRead]);

  const otherLastReadAt = useMemo(() => {
    if (!thread?.lastReadAt || !otherUserId) return null;
    return thread.lastReadAt[otherUserId] || null;
  }, [thread?.lastReadAt, otherUserId]);

  // -----------------------------
  // ✅ Typing Indicators (thread.typing[uid])
  // -----------------------------
  const typingTimerRef = useRef<any>(null);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!threadRef || !user?.uid) return;
    updateDocumentNonBlocking(threadRef, {
      [`typing.${user.uid}`]: isTyping,
    });
  }, [threadRef, user?.uid]);

  useEffect(() => {
    // Cleanup typing state on unmount
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      setTyping(false);
    };
  }, [setTyping]);

  const onInputTyping = (value: string) => {
    setNewMessage(value);

    if (!threadRef || !user?.uid) return;

    // Set typing true immediately
    setTyping(true);

    // Debounce auto-off after inactivity
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const isOtherTyping = useMemo(() => {
    if (!thread?.typing || !otherUserId) return false;
    return !!thread.typing[otherUserId];
  }, [thread?.typing, otherUserId]);

  // -----------------------------
  // ✅ Lock chat after completion
  // -----------------------------
  const threadLocked = !!thread?.locked;
  const taskLocked = isTaskChatLocked(task);
  const chatLocked = threadLocked || taskLocked;

  // If task becomes locked, write to thread + add SYSTEM message (one-time best-effort)
  useEffect(() => {
    if (!threadRef || !task) return;
    if (!isTaskChatLocked(task)) return;

    // Best effort: mark thread locked
    updateDocumentNonBlocking(threadRef, { locked: true });

    // Best effort: add system message
    addDocumentNonBlocking(collection(threadRef, 'messages'), {
      senderId: user?.uid || 'system',
      text: 'Chat locked: task has been completed/closed.',
      createdAt: serverTimestamp(),
      type: 'SYSTEM',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.status, threadRef]);

  const handleSendMessage = () => {
    if (chatLocked) return;
    if (!newMessage.trim() || !threadRef || !user) return;

    const messageData = {
      senderId: user.uid,
      text: newMessage,
      createdAt: serverTimestamp(),
      type: 'TEXT' as const,
    };

    addDocumentNonBlocking(collection(threadRef, 'messages'), messageData);

    updateDocumentNonBlocking(threadRef, {
      lastMessagePreview: newMessage,
      lastMessageAt: serverTimestamp(),
      [`typing.${user.uid}`]: false,
      [`lastReadAt.${user.uid}`]: serverTimestamp(),
    });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    if (isToday(date)) return format(date, 'p');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const isLoading =
    isUserLoading ||
    isThreadLoading ||
    areMessagesLoading ||
    isOtherUserLoading ||
    isTaskLoading;

  const canMakeOffer = role === 'helper' && task?.status === 'OPEN' && !chatLocked;

  if (isLoading) return <ChatSkeleton />;

  if (!canRead || threadError || messagesError || !thread) {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="font-headline text-2xl font-bold">Chat Unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          This conversation may have been deleted or you don’t have access to it.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/inbox">Back to Inbox</Link>
        </Button>
      </div>
    );
  }

  if (!otherUser || !task) {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="font-headline text-2xl font-bold">Chat Loaded Partially</h1>
        <p className="mt-2 text-muted-foreground">
          The conversation loaded, but related details could not be fetched.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/inbox">Back to Inbox</Link>
        </Button>
      </div>
    );
  }

  // Read receipt display: show on last message sent by current user
  const lastMyMessageId = (() => {
    const arr = messages ?? [];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].senderId === user?.uid && arr[i].type === 'TEXT') return arr[i].id;
    }
    return null;
  })();

  const isSeen = (msg: ChatMessage) => {
    if (!otherLastReadAt || !msg.createdAt) return false;
    try {
      return otherLastReadAt.toDate().getTime() >= msg.createdAt.toDate().getTime();
    } catch {
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8 auto-rows-max">
      {/* CHAT PANEL */}
      <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg">
        <div className="flex items-center gap-4 p-4 border-b">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/inbox">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>

          <Avatar>
            <AvatarImage src={otherUser.profilePhotoUrl} alt={otherUser.fullName} />
            <AvatarFallback>{otherUser.fullName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-semibold">{otherUser.fullName}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{task.title}</p>
            {isOtherTyping && !chatLocked && (
              <p className="text-xs text-muted-foreground mt-0.5">Typing…</p>
            )}
            {chatLocked && (
              <p className="text-xs text-muted-foreground mt-0.5">Chat locked</p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">
            {(messages ?? []).map((msg) => {
              const mine = msg.senderId === user.uid;
              const showSeen = mine && msg.id === lastMyMessageId && isSeen(msg);

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${mine ? 'justify-end' : ''}`}
                >
                  {!mine && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherUser.profilePhotoUrl} />
                      <AvatarFallback>{otherUser.fullName[0]}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                      mine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>

                    <div className="flex items-center justify-between gap-3 mt-1">
                      <p className={`text-xs ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </p>

                      {showSeen && (
                        <p className="text-xs opacity-70">Seen</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t">
          {chatLocked ? (
            <div className="text-sm text-muted-foreground">
              This chat is locked because the task is closed.
            </div>
          ) : (
            <div className="relative">
              <Input
                placeholder="Type your message..."
                className="pr-12"
                value={newMessage}
                onChange={(e) => onInputTyping(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="icon"
                className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* SIDE PANEL */}
      <div className="space-y-8">
        {canMakeOffer && (
          <Card>
            <CardHeader>
              <CardTitle>Make an Offer</CardTitle>
              <CardDescription>Ready to submit a formal offer? Fill out the details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <OfferForm task={task} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-muted-foreground">{task.description}</p>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{task.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium">
                {task.budget.min} - {task.budget.max} TZS
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/dashboard/tasks/${task.id}`}>View Full Task</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
      <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg">
        <div className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-16 w-1/2 ml-auto" />
          <Skeleton className="h-8 w-2/3" />
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
