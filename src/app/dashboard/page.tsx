import Link from 'next/link';
import { PlusCircle, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { tasks, offers, users } from '@/lib/data';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const customerId = 'user-1';
  const customerTasks = tasks.filter((task) => task.customerId === customerId);

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold">My Tasks</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/tasks/new">
              <PlusCircle className="h-4 w-4" />
              <span className="ml-2">Post New Task</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Your Active and Past Tasks</CardTitle>
          <CardDescription>
            An overview of all the tasks you&apos;ve posted on tasKey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Offers</TableHead>
                <TableHead className="hidden md:table-cell">Posted On</TableHead>
                <TableHead className="text-right">Budget (TZS)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerTasks.map((task) => {
                const taskOffers = offers.filter(
                  (offer) => offer.taskId === task.id
                );
                const assignedHelper = users.find(u => u.id === task.assignedHelperId);
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {assignedHelper ? `Assigned to ${assignedHelper.name}` : task.location}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {task.category}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        className="capitalize"
                        variant={
                          task.status === 'open'
                            ? 'secondary'
                            : task.status === 'completed'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {taskOffers.length}
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      {format(task.createdAt, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                        {`${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/tasks/${task.id}`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
