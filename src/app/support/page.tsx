
'use client';

import Link from 'next/link';
import { Mail, LifeBuoy, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppSidebar } from '@/app/dashboard/sidebar';
import AppHeader from '@/app/dashboard/header';
import { UserRoleProvider } from '@/context/user-role-context';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const supportFormSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters long." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters long." }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a ticket.' });
      return;
    }

    const ticketData = {
      userId: user.uid,
      userEmail: user.email,
      subject: data.subject,
      message: data.message,
      status: 'NEW',
      createdAt: serverTimestamp(),
    };

    const ticketsCollection = collection(firestore, 'support_tickets');
    addDocumentNonBlocking(ticketsCollection, ticketData);
    
    toast({ title: 'Support Ticket Submitted', description: "We've received your request and will get back to you shortly." });
    form.reset();
  };

  return (
    <UserRoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <AppHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid w-full max-w-2xl auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                  <Link href="/dashboard">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap font-headline text-xl font-semibold tracking-tight sm:grow-0">
                  Support Center
                </h1>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-3">
                    <LifeBuoy className="h-6 w-6" />
                    <span>Contact Support</span>
                  </CardTitle>
                  <CardDescription>
                    Have a question or experiencing an issue? Let us know.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 rounded-md border bg-secondary/50 p-4">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">For urgent issues, email us directly</p>
                      <a href="mailto:support@taskey.app" className="font-semibold text-primary hover:underline">
                        support@taskey.app
                      </a>
                    </div>
                  </div>
                </CardContent>
                <Separator className="my-4" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className='font-headline text-lg'>Submit a Support Ticket</CardTitle>
                        <CardDescription>Use the form below to send a message to our support team.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Issue with task payment" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your issue in as much detail as possible..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </UserRoleProvider>
  );
}

    