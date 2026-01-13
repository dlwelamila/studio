'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// This is a mock data structure. In a real app, this would be fetched from a
// 'transparency_log' collection in Firestore.
const mockLogData = [
  {
    id: 1,
    date: new Date(2024, 6, 20),
    event: 'Task Completed',
    reason: 'Completed "Clean my apartment" on time.',
    impact: 'positive',
  },
  {
    id: 2,
    date: new Date(2024, 6, 18),
    event: 'Task Cancelled',
    reason: 'Cancelled "Mow the lawn" after accepting the offer.',
    impact: 'negative',
  },
    {
    id: 3,
    date: new Date(2024, 6, 15),
    event: 'Task Completed',
    reason: 'Completed "Walk my dog" on time.',
    impact: 'positive',
  },
];

export function ReliabilityLog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          <HelpCircle className="mr-1 h-3 w-3" />
          Why?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reliability Score History</DialogTitle>
          <DialogDescription>
            Your score changes based on your actions. Completing tasks on time improves it, while cancellations or disputes can lower it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {mockLogData.map((item) => (
                <div key={item.id} className="grid grid-cols-[24px_1fr] items-start gap-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                        {item.impact === 'positive' ? (
                            <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <ArrowDown className="h-4 w-4 text-destructive" />
                        )}
                    </span>
                    <div className="grid gap-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{item.event}</p>
                            <p className="text-xs text-muted-foreground">{format(item.date, 'MMM d, yyyy')}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </div>
                </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
