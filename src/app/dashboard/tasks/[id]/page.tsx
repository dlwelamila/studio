'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Copy,
  CreditCard,
  MoreVertical,
  Star,
  Truck,
  File,
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { tasks, users, offers as allOffers } from '@/lib/data';
import { format } from 'date-fns';
import { OfferCard } from './offer-card';
import { RecommendedHelpers } from './recommended-helpers';
import { useUserRole } from '@/context/user-role-context';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  // In a real app, this would be a server component fetching from a DB.
  // For this demo, we'll simulate role-based rendering on the client.
  const task = tasks.find((t) => t.id === params.id);
  const { role } = useUserRole();

  if (!task) {
    return (
      <div>
        <h1 className="font-headline text-2xl font-bold">Task not found</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  const customer = users.find((u) => u.id === task.customerId);
  const offers = allOffers.filter((o) => o.taskId === task.id);
  const helper = users.find(u => u.id === 'user-2'); // Assume current helper is user-2

  const isCustomerView = role === 'customer';
  const hasMadeOffer = offers.some(o => o.helperId === helper?.id);

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={isCustomerView ? "/dashboard" : "/dashboard/browse"}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            Task Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Task ID: {task.id}
          </p>
        </div>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button size="sm">Get Help</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">{task.title}</CardTitle>
                <CardDescription>{task.category} &middot; {task.location}</CardDescription>
              </div>
               <Badge
                className="capitalize text-nowrap"
                variant={
                    task.status === 'open' ? 'secondary' : task.status === 'completed' ? 'default' : 'outline'
                }
                >
                {task.status.replace('_', ' ')}
                </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {task.description}
              </p>
              <Separator className="my-6" />
               <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold text-foreground">Budget</div>
                    <div className="text-primary font-bold text-lg">
                        {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                    </div>
                </div>
                 <div>
                    <div className="font-semibold text-foreground">Posted On</div>
                    <div className="text-muted-foreground">
                        {format(task.createdAt, 'PP')}
                    </div>
                </div>
               </div>
            </CardContent>
          </Card>
          
          {isCustomerView ? (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Offers ({offers.length})</CardTitle>
                        <CardDescription>
                            Review the offers from helpers below. You can view their profile before accepting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {offers.length > 0 ? offers.map(offer => (
                            <OfferCard key={offer.id} offer={offer} />
                        )) : (
                            <div className="text-center py-8 text-muted-foreground">No offers received yet.</div>
                        )}
                    </CardContent>
                </Card>
                <RecommendedHelpers task={task} />
            </>
          ) : (
            <>
                {task.status === 'open' && !hasMadeOffer && (
                    <Card>
                        <CardHeader>
                        <CardTitle className="font-headline">Make an Offer</CardTitle>
                        <CardDescription>
                            Submit your price and a message to the customer.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Your Price (TZS)</Label>
                                    <Input id="price" type="number" placeholder="e.g., 25,000" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message">Message to Customer</Label>
                                    <Textarea id="message" placeholder="Introduce yourself and explain why you're a good fit for this task." className="min-h-24" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto">Submit Offer</Button>
                        </CardFooter>
                    </Card>
                )}
                {task.status === 'open' && hasMadeOffer && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Offer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">You have already submitted an offer for this task. The customer will be in touch if they select you.</p>
                        </CardContent>
                    </Card>
                )}
                 {task.status !== 'open' && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Task Not Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">This task is no longer open for offers.</p>
                        </CardContent>
                    </Card>
                )}
            </>
          )}

        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Posted by</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Image
                        alt="Customer avatar"
                        className="rounded-full"
                        height={40}
                        src={customer?.avatarUrl || ''}
                        style={{ aspectRatio: '40/40', objectFit: 'cover' }}
                        width={40}
                    />
                    <div>
                        <div className="font-semibold">{customer?.name}</div>
                        <div className="text-sm text-muted-foreground">{customer?.location}</div>
                    </div>
                </div>
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-muted-foreground text-muted-foreground" />
                    <span className="ml-1 text-foreground font-semibold">4.0</span> (5 reviews)
                 </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
