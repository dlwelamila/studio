'use client';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  Users2,
  Package2,
  Settings,
  Handshake,
  MessagesSquare,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useUserRole } from '@/context/user-role-context';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CustomerNav = [
  { href: '/dashboard', label: 'My Tasks', icon: Home },
  { href: '/dashboard/tasks/new', label: 'New Task', icon: Package2 },
  { href: '/dashboard/inbox', label: 'Inbox', icon: MessagesSquare },
];

const HelperNav = [
  { href: '/dashboard/browse', label: 'Browse Tasks', icon: Home },
  { href: '/dashboard/gigs', label: 'My Gigs', icon: Briefcase },
  { href: '/dashboard/inbox', label: 'Inbox', icon: MessagesSquare },
];

export function AppSidebar() {
  const { role } = useUserRole();
  const pathname = usePathname();

  const navItems = role === 'customer' ? CustomerNav : HelperNav;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Handshake className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">tasKey</span>
          </Link>

          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname.startsWith(item.href) && item.href !== '/dashboard' || (pathname === '/dashboard' && item.href === '/dashboard') ?
                      'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/profile"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                  (pathname === '/dashboard/profile' || pathname === '/dashboard/settings') &&
                    'bg-accent text-accent-foreground'
                )}
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Profile & Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile & Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}