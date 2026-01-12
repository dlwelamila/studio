'use client';

import Link from 'next/link';
import { Mail, LifeBuoy, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppSidebar } from '@/app/dashboard/sidebar';
import AppHeader from '@/app/dashboard/header';
import { UserRoleProvider } from '@/context/user-role-context';


export default function SupportPage() {
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
                        If you're experiencing issues with your account or have questions, please reach out to our support team.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="mb-4 text-muted-foreground">
                        To resolve account issues, including suspensions, please send a detailed email to our support team. Include your account email and a description of the problem. We aim to respond within 24-48 hours.
                    </p>
                    <div className="flex items-center gap-4 rounded-md border bg-secondary/50 p-4">
                        <Mail className="h-6 w-6 text-muted-foreground" />
                        <div>
                        <p className="text-sm text-muted-foreground">Support Email</p>
                        <a href="mailto:support@taskey.app" className="font-semibold text-primary hover:underline">
                            support@taskey.app
                        </a>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </div>
          </main>
        </div>
      </div>
    </UserRoleProvider>
  );
}
