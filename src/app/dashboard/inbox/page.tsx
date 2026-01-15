'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { TaskChat } from '@/lib/data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function InboxPage() {
    const { role } = useUserRole();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const chatsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        // This query now matches the security rules
        return query(
            collection(firestore, 'task_chats'),
            where('participantIds', 'array-contains', user.uid)
        );
    }, [user, firestore]);

    const { data: chats, isLoading: areChatsLoading } = useCollection<TaskChat>(chatsQuery);

    const isLoading = isUserLoading || areChatsLoading;

    const description = role === 'customer' 
        ? "This is where you'll find your conversations with helpers."
        : "This is where you'll find your conversations with your customers.";

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
                <CardContent className="grid gap-4">
                   {isLoading && Array.from({ length: 3 }).map((_, i) => <ChatItemSkeleton key={i} />)}
                   {!isLoading && chats && chats.length > 0 ? (
                       chats.map(chat => (
                           <ChatItem key={chat.id} chat={chat} />
                       ))
                   ) : (
                       !isLoading && (
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
    )
}


function ChatItem({ chat }: { chat: TaskChat }) {
    return (
        <Link
            href={`/dashboard/inbox/${chat.id}`}
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
            <div className="flex-1">
                <p className="font-semibold">{chat.taskTitle}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{chat.lastMessage?.text || 'No messages yet'}</p>
            </div>
            <div className="text-right">
                {chat.lastMessage?.timestamp && (
                     <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(chat.lastMessage.timestamp.toDate(), { addSuffix: true })}
                    </p>
                )}
               <Badge variant="outline" className="mt-2">{chat.participantIds.length - 1} helpers</Badge>
            </div>
        </Link>
    )
}

function ChatItemSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="h-4 w-24 ml-auto" />
                <Skeleton className="h-5 w-16 ml-auto" />
            </div>
        </div>
    )
}
