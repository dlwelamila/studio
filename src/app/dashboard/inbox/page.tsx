// This is a placeholder file for the new Inbox page.
// The full implementation will be provided in a subsequent step.
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';

export default function InboxPage() {
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
                        This is where you'll find your conversations with helpers and customers.
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