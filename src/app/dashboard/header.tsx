'use client';
import Link from 'next/link';
import { Home, PanelLeft, Settings, Package, Package2, Users2, Briefcase, Handshake, Repeat } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useUserRole } from '@/context/user-role-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import type { Helper, Customer } from '@/lib/data';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
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

export default function AppHeader() {
  const { role, toggleRole } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    // We fetch based on the current active role to display the correct profile info.
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);
  
  // We need to know if both profiles exist to conditionally show the switch option.
  const customerProfileRef = useMemoFirebase(() => (firestore && authUser) ? doc(firestore, 'customers', authUser.uid) : null, [firestore, authUser]);
  const helperProfileRef = useMemoFirebase(() => (firestore && authUser) ? doc(firestore, 'helpers', authUser.uid) : null, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Helper | Customer>(userRef);
  const { data: customerProfile } = useDoc<Customer>(customerProfileRef);
  const { data: helperProfile } } = useDoc<Helper>(helperProfileRef);


  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const breadcrumbText = role === 'customer' ? 'My Tasks' : 'Browse Tasks';
  const canBeHelper = !!helperProfile;
  const canBeCustomer = !!customerProfile;
  const canSwitchRoles = canBeHelper && canBeCustomer;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Handshake className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">tasKey</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
             {role === 'customer' ? (
                <Link href="/dashboard/tasks/new" className="flex items-center gap-4 px-2.5 text-foreground">
                    <Package className="h-5 w-5" />
                    New Task
                </Link>
            ) : (
                 <Link href="/dashboard/gigs" className="flex items-center gap-4 px-2.5 text-foreground">
                    <Briefcase className="h-5 w-5" />
                    My Gigs
                </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Profile
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              {isUserLoading || isProfileLoading || !userProfile ? (
                 <Skeleton className="h-9 w-9 rounded-full" />
              ) : (
                <Image
                    src={userProfile.profilePhotoUrl}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userProfile?.fullName || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canSwitchRoles && (
              <>
                <DropdownMenuItem onSelect={toggleRole}>
                  <Repeat className="mr-2 h-4 w-4" />
                  <span>Switch to {role === 'customer' ? 'Helper' : 'Customer'} View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
