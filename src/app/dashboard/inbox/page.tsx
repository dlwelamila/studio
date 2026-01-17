'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { TaskThread, Helper, Customer, Task } from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessagesSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function InboxPage() {
  const { role } = useUserRole();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const customerThreadsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !user?.uid) return null;

    return query(
      collection(firestore, 'task_threads'),
      where('customerId', '==', user.uid)
    );
  }, [firestore, isUserLoading, user?.uid]);

  const helperThreadsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !user?.uid) return null;

    return query(
      collection(firestore, 'task_threads'),
      where('helperId', '==', user.uid)
    );
  }, [firestore, isUserLoading, user?.uid]);

  const {
    data: customerThreads,
    isLoading: areCustomerThreadsLoading,
    error: customerThreadsError,
  } = useCollection<TaskThread>(customerThreadsQuery, { emitPermissionErrors: false });

  const {
    data: helperThreads,
    isLoading: areHelperThreadsLoading,
    error: helperThreadsError,
  } = useCollection<TaskThread>(helperThreadsQuery, { emitPermissionErrors: false });

  const threads = useMemo(() => {
    const aggregated = new Map<string, TaskThread>();
    const allThreads = [...(customerThreads ?? []), ...(helperThreads ?? [])];

    allThreads.forEach((thread) => {
      if (!aggregated.has(thread.id)) {
        aggregated.set(thread.id, thread);
      }
    });

    const toTime = (thread: TaskThread) => {
      const timestamp = thread.lastMessageAt ?? thread.createdAt;
      return timestamp ? timestamp.toDate().getTime() : 0;
    };

    return Array.from(aggregated.values())
      .sort((a, b) => toTime(b) - toTime(a))
      .slice(0, 50);
  }, [customerThreads, helperThreads]);

  const threadsError = customerThreadsError ?? helperThreadsError;

  const isLoading = isUserLoading || areCustomerThreadsLoading || areHelperThreadsLoading;

  const description =
    role === 'customer'
      ? "This is where you'll find your conversations with helpers interested in your tasks."
      : "This is where you'll find your conversations with customers about tasks you are participating in.";

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <h1 className="font-headline text-2xl font-bold">Inbox</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessagesSquare />
            Your Conversations
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-2">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <ThreadItemSkeleton key={i} />)}

          {!isLoading && threadsError && (
            <div className="text-center py-10 text-muted-foreground">
              <p>Could not load conversations.</p>
              <p className="text-xs mt-1">You may not have access, or your connection is unstable.</p>
            </div>
          )}

          {!isLoading && !threadsError && threads && threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} currentUserId={user!.uid} />
            ))
          ) : (
            !isLoading &&
            !threadsError && (
              <div className="text-center py-16 text-muted-foreground">
                <p>You have no conversations yet.</p>
                {role === 'helper' && <p>Participate in a task to start a chat.</p>}
                {role === 'customer' && <p>Helpers will appear here when they participate in your tasks.</p>}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ThreadItem({
  thread,
  currentUserId,
}: {
  thread: TaskThread;
  currentUserId: string;
}) {
  const firestore = useFirestore();

  const activityTimestamp = thread.lastMessageAt ?? thread.createdAt;

  const myLastReadAt = thread.lastReadAt?.[currentUserId];
  const lastMessageTimestamp = thread.lastMessageAt;
  const lastMessageSenderId = thread.lastMessageSenderId;

  const lastMessageFromOther = lastMessageSenderId != null
    ? lastMessageSenderId !== currentUserId
    : !!lastMessageTimestamp && (!myLastReadAt || myLastReadAt.toMillis() < lastMessageTimestamp.toMillis());
  const isUnread =
    lastMessageFromOther &&
    !!lastMessageTimestamp &&
    (!myLastReadAt || myLastReadAt.toMillis() < lastMessageTimestamp.toMillis());
  const unreadCountRaw = thread.unreadCounts?.[currentUserId];
  const unreadCount = typeof unreadCountRaw === 'number' && unreadCountRaw > 0 ? unreadCountRaw : isUnread ? 1 : 0;

  // 🔒 Do NOT trust UI role here (your app can default to customer / allow switching).
  // Infer my side from the thread document itself.
  const mySide: 'customer' | 'helper' | null =
    currentUserId === thread.customerId ? 'customer' :
    currentUserId === thread.helperId ? 'helper' :
    null;

  const otherUserId =
    mySide === 'customer' ? thread.helperId :
    mySide === 'helper' ? thread.customerId :
    null;

  const otherUserCollection =
    mySide === 'customer' ? 'helpers' :
    mySide === 'helper' ? 'customers' :
    null;

  const otherUserRef = useMemoFirebase(() => {
    if (!firestore || !otherUserId || !otherUserCollection) return null;
    return doc(firestore, otherUserCollection, otherUserId);
  }, [firestore, otherUserCollection, otherUserId]);

  const taskRef = useMemoFirebase(() => {
    if (!firestore || !thread.taskId) return null;
    return doc(firestore, 'tasks', thread.taskId);
  }, [firestore, thread.taskId]);

  const { data: otherUser, isLoading: isUserLoading } = useDoc<Helper | Customer>(otherUserRef);
  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const isLoading = isUserLoading || isTaskLoading;

  const otherUserIsTyping = otherUserId ? Boolean(thread.typing?.[otherUserId]) : false;
  const previewText = otherUserIsTyping ? 'Typing...' : thread.lastMessagePreview || 'No messages yet';
  const previewClasses = cn(
    'text-xs truncate mt-1',
    otherUserIsTyping ? 'text-primary font-medium' : unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'
  );

  // ✅ Always use the stored thread id to support legacy and new documents
  const threadLinkId = thread.id;

  return (
    <Link
      href={`/dashboard/inbox/${threadLinkId}`}
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50',
        unreadCount > 0 && 'border-primary bg-primary/5',
        otherUserIsTyping && 'border-dashed'
      )}
    >
      {isLoading || !otherUser ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherUser.profilePhotoUrl || undefined} alt={otherUser.fullName} />
          <AvatarFallback>{otherUser.fullName?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="font-semibold truncate">
          {isLoading ? <Skeleton className="h-5 w-32" /> : <span>{otherUser?.fullName}</span>}
        </div>

        <div className="text-sm text-muted-foreground truncate">
          {isLoading ? <Skeleton className="h-4 w-48 mt-1" /> : <span>{task?.title}</span>}
        </div>

        <div className={previewClasses}>
          {isLoading ? <Skeleton className="h-3 w-40" /> : previewText}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        {activityTimestamp && (
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(activityTimestamp.toDate(), { addSuffix: true })}
          </p>
        )}
        {unreadCount > 0 && (
          <Badge className="mt-2" variant="default">{unreadCount > 99 ? '99+' : unreadCount}</Badge>
        )}
      </div>
    </Link>
  );
}

function ThreadItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-24 ml-auto" />
      </div>
    </div>
  );
}
