'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  PanelLeft,
  Settings,
  Users2,
  Briefcase,
  Handshake,
  Repeat,
  PlusCircle,
  LifeBuoy,
  MessagesSquare,
  ClipboardList,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

import { useUserRole } from '@/context/user-role-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useAuth, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Helper, Customer, TaskThread } from '@/lib/data';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/client-only';

const breadcrumbMap: Record<string, Record<string, string>> = {
  customer: {
    '/dashboard': 'My Tasks',
    '/dashboard/tasks/new': 'New Task',
    '/dashboard/profile': 'My Profile',
    '/dashboard/inbox': 'Inbox',
    '/support': 'Support',
  },
  helper: {
    '/dashboard': 'Browse Tasks',
    '/dashboard/browse': 'Browse Tasks',
    '/dashboard/gigs': 'My Gigs',
    '/dashboard/profile': 'My Profile',
    '/dashboard/inbox': 'Inbox',
    '/support': 'Support',
  },
};

export default function AppHeader() {
  const { role, toggleRole, hasCustomerProfile, hasHelperProfile, isRoleLoading } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser || !role) return null;
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Helper | Customer>(userRef);

  const customerThreadsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'task_threads'), where('customerId', '==', authUser.uid));
  }, [firestore, authUser]);

  const helperThreadsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'task_threads'), where('helperId', '==', authUser.uid));
  }, [firestore, authUser]);

  const { data: customerThreads } = useCollection<TaskThread>(customerThreadsQuery, { emitPermissionErrors: false });
  const { data: helperThreads } = useCollection<TaskThread>(helperThreadsQuery, { emitPermissionErrors: false });

  const aggregatedThreads = useMemo(() => {
    const map = new Map<string, TaskThread>();
    [...(customerThreads ?? []), ...(helperThreads ?? [])].forEach((thread) => {
      if (!map.has(thread.id)) {
        map.set(thread.id, thread);
      }
    });
    return Array.from(map.values());
  }, [customerThreads, helperThreads]);

  const totalUnreadCount = useMemo(() => {
    const userId = authUser?.uid;
    if (!userId) return 0;

    return aggregatedThreads.reduce((sum, thread) => {
      const rawCount = thread.unreadCounts?.[userId];
      if (typeof rawCount === 'number' && rawCount > 0) {
        return sum + rawCount;
      }

      const lastReadMillis = thread.lastReadAt?.[userId]?.toMillis?.();
      const lastMessageMillis = thread.lastMessageAt?.toMillis?.();
      const lastSenderId = thread.lastMessageSenderId;
      const lastMessageFromOther = lastSenderId != null ? lastSenderId !== userId : true;

      if (lastMessageMillis && lastMessageFromOther && (!lastReadMillis || lastReadMillis < lastMessageMillis)) {
        return sum + 1;
      }

      return sum;
    }, 0);
  }, [aggregatedThreads, authUser?.uid]);

  const unreadBadgeText = totalUnreadCount > 99 ? '99+' : totalUnreadCount.toString();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const getBreadcrumbText = () => {
    const roleRoutes = role ? breadcrumbMap[role] || {} : {};
    const matchingRoute = Object.keys(roleRoutes).find(
      (route) => pathname.startsWith(route) && (pathname.length === route.length || pathname[route.length] === '/'),
    );
    if (matchingRoute) {
      return roleRoutes[matchingRoute];
    }
    if (pathname.startsWith('/dashboard/tasks/')) {
      return 'Task Details';
    }
    if (pathname.startsWith('/dashboard/inbox/')) {
      return 'Chat';
    }
    return 'Dashboard';
  };

  const breadcrumbText = getBreadcrumbText();
  const canSwitchRoles = hasCustomerProfile && hasHelperProfile;

  const isLoading = isUserLoading || isProfileLoading || isRoleLoading || !role;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <ClientOnly>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                onClick={() => setSheetOpen(false)}
              >
                <Handshake className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">tasKey</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSheetOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              {role === 'customer' ? (
                <Link
                  href="/dashboard/tasks/new"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                  onClick={() => setSheetOpen(false)}
                >
                  <PlusCircle className="h-5 w-5" />
                  New Task
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard/browse"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setSheetOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Browse Tasks
                  </Link>
                  <Link
                    href="/dashboard/offers"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setSheetOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    My Offers
                  </Link>
                  <Link
                    href="/dashboard/gigs"
                    className="flex items-center gap-4 px-2.5 text-foreground"
                    onClick={() => setSheetOpen(false)}
                  >
                    <Briefcase className="h-5 w-5" />
                    My Gigs
                  </Link>
                </>
              )}
              <Link
                href="/dashboard/inbox"
                className="flex items-center justify-between gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSheetOpen(false)}
              >
                <span className="flex items-center gap-4">
                  <MessagesSquare className="h-5 w-5" />
                  Inbox
                </span>
                {totalUnreadCount > 0 && <Badge variant="secondary">{unreadBadgeText}</Badge>}
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSheetOpen(false)}
              >
                <Users2 className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSheetOpen(false)}
              >
                <LifeBuoy className="h-5 w-5" />
                Support
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </ClientOnly>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbText}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex items-center md:grow-0 gap-4">
        {authUser && (
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/inbox">
              <MessagesSquare className="h-5 w-5" />
              <span className="sr-only">Inbox</span>
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unreadBadgeText}
                </span>
              )}
            </Link>
          </Button>
        )}
        <ClientOnly>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                {isLoading || !userProfile ? (
                  <Skeleton className="h-9 w-9 rounded-full" />
                ) : (
                  <Image
                    src={userProfile.profilePhotoUrl}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full object-cover"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {isLoading ? <Skeleton className="h-4 w-24" /> : userProfile?.fullName || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoading ? (
                <DropdownMenuItem disabled>
                  <Skeleton className="h-4 w-32" />
                </DropdownMenuItem>
              ) : canSwitchRoles ? (
                <DropdownMenuItem onSelect={toggleRole}>
                  <Repeat className="mr-2 h-4 w-4" />
                  <span>Switch to {role === 'customer' ? 'Helper' : 'Customer'} View</span>
                </DropdownMenuItem>
              ) : !hasHelperProfile ? (
                <DropdownMenuItem onSelect={() => router.push('/onboarding/create-profile?role=helper')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Become a Helper</span>
                </DropdownMenuItem>
              ) : !hasCustomerProfile ? (
                <DropdownMenuItem onSelect={() => router.push('/onboarding/create-profile?role=customer')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Start Hiring</span>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/support')}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ClientOnly>
      </div>
    </header>
  );
}
