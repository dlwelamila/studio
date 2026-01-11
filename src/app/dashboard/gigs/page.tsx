'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { tasks, users } from '@/lib/data';
import { useUserRole } from '@/context/user-role-context';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MyGigsPage() {
  const { role } = useUserRole();

  // In a real app, you'd fetch the current user's ID
  const helperId = 'user-2'; 
  
  const myGigs = tasks.filter(
    (task) => task.assignedHelperId === helperId && (task.status === 'assigned' || task.status === 'in_progress' || task.status === 'completed')
  );

  if (role === 'customer') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This page is only available to helpers. Please switch to your helper profile to view your gigs.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-6">My Gigs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Tasks</CardTitle>
          <CardDescription>
            Here are the tasks that have been assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="text-right">Earnings (TZS)</TableHead>
                 <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myGigs.length > 0 ? (
                myGigs.map((gig) => {
                  const customer = users.find((u) => u.id === gig.customerId);
                  // Find the offer that was accepted for this task to get the price
                  const price = gig.budget.max; // Fallback to max budget if offer not found
                  return (
                    <TableRow key={gig.id}>
                      <TableCell>
                        <div className="font-medium">{gig.title}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {gig.location}
                        </div>
                      </TableCell>
                       <TableCell className="hidden sm:table-cell">{customer?.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          className="capitalize"
                          variant={
                            gig.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {gig.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(gig.createdAt, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {price.toLocaleString()}
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/tasks/${gig.id}`}>
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    You have no assigned gigs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
