'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, orderBy, limit } from 'firebase/firestore';
import type { TaskThread, Helper, Customer, Task } from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export default function InboxPage() {
  const { role } = useUserRole();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const threadsQuery = useMemoFirebase(() => {
    // Gate on auth ready
    if (!firestore || isUserLoading || !user?.uid) return null;

    return query(
      collection(firestore, 'task_threads'),
      where('participantIds', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc'),
      limit(50),
    );
  }, [firestore, isUserLoading, user?.uid]);

  const { data: threads, isLoading: areThreadsLoading, error: threadsError } =
    useCollection<TaskThread>(threadsQuery, { emitPermissionErrors: false });

  const isLoading = isUserLoading || areThreadsLoading;

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
              <ThreadItem key={thread.id} thread={thread} currentUserId={user!.uid} role={role} />
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
  role,
}: {
  thread: TaskThread;
  currentUserId: string;
  role: 'customer' | 'helper';
}) {
  const firestore = useFirestore();

  const otherUserId = role === 'customer' ? thread.helperId : thread.customerId;
  const otherUserCollection = role === 'customer' ? 'helpers' : 'customers';

  const otherUserRef = useMemoFirebase(() => {
    if (!firestore || !otherUserId) return null;
    return doc(firestore, otherUserCollection, otherUserId);
  }, [firestore, otherUserCollection, otherUserId]);

  const taskRef = useMemoFirebase(() => {
    if (!firestore || !thread.taskId) return null;
    return doc(firestore, 'tasks', thread.taskId);
  }, [firestore, thread.taskId]);

  const { data: otherUser, isLoading: isUserLoading } = useDoc<Helper | Customer>(otherUserRef);
  const { data: task, isLoading: isTaskLoading } = useDoc<Task>(taskRef);

  const isLoading = isUserLoading || isTaskLoading;
  
  // Always derive the canonical ID to prevent linking to invalid legacy documents.
  const canonicalThreadId = `${thread.taskId}_${thread.customerId}_${thread.helperId}`;

  return (
    <Link
      href={`/dashboard/inbox/${canonicalThreadId}`}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      {isLoading || !otherUser ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <Image
          src={otherUser.profilePhotoUrl}
          alt={otherUser.fullName}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      )}

      <div className="flex-1 overflow-hidden">
        <div className="font-semibold truncate">
          {isLoading ? <Skeleton className="h-5 w-32" /> : <span>{otherUser?.fullName}</span>}
        </div>

        <div className="text-sm text-muted-foreground truncate">
          {isLoading ? <Skeleton className="h-4 w-48 mt-1" /> : <span>{task?.title}</span>}
        </div>

        <p className="text-xs text-muted-foreground truncate mt-1">
          {thread.lastMessagePreview || 'No messages yet'}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        {thread.lastMessageAt && (
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(thread.lastMessageAt.toDate(), { addSuffix: true })}
          </p>
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
