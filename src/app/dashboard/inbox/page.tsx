'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';
import { useUserRole } from '@/context/user-role-context';

export default function InboxPage() {
    const { role } = useUserRole();

    const description = role === 'customer' 
        ? "This is where you'll find your conversations with your helpers."
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
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Inbox functionality is coming soon!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
