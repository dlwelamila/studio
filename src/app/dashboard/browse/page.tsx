import Link from 'next/link';
import {
  ArrowRight,
  ListFilter,
  Search,
  Star,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { tasks, users, taskCategories } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

export default function HelperDashboard() {
  const helper = users.find((u) => u.role === 'helper' && u.id === 'user-2');
  const openTasks = tasks.filter((task) => task.status === 'open');

  if (!helper) return <div>Helper not found</div>;

  return (
    <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{helper.name}</CardTitle>
            <CardDescription>
              {helper.verified && (
                <Badge variant="secondary">Verified Helper</Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span>Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{helper.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed Gigs</span>
                <span>{helper.completedTasks}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
                <Link href="/dashboard/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
        <div className="flex items-center">
            <h1 className="font-headline text-2xl font-bold">Available Tasks</h1>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {taskCategories.map(cat => (
                    <DropdownMenuCheckboxItem key={cat} checked>
                    {cat}
                    </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by location..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {openTasks.map(task => {
                const customer = users.find(u => u.id === task.customerId);
                return (
                    <Card key={task.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{task.category}</Badge>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                                </div>
                            </div>
                            <CardTitle className="font-headline pt-2">{task.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
                            <Separator className="my-4" />
                            <div className="text-sm font-semibold">Budget (TZS)</div>
                            <div className="text-lg font-bold text-primary">{`${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}</div>
                            <div className="mt-2 text-xs text-muted-foreground">{task.location}</div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href={`/dashboard/tasks/${task.id}`}>
                                    View & Make Offer <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
}
