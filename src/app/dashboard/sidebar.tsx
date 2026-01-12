'use client';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  Users,
  PlusCircle,
  Settings,
  Bell,
  PanelLeft,
  Handshake,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/logo';
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
  { href: '/dashboard/tasks/new', label: 'New Task', icon: PlusCircle },
];

const HelperNav = [
  { href: '/dashboard', label: 'Browse Tasks', icon: Home },
  { href: '/dashboard/gigs', label: 'My Gigs', icon: Briefcase },
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
                    pathname === item.href &&
                      'bg-accent text-accent-foreground'
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
                  pathname === '/dashboard/profile' &&
                    'bg-accent text-accent-foreground'
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
