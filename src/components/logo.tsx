import type { SVGProps } from 'react';
import { Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  ...props
}: SVGProps<SVGSVGElement> & { iconOnly?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="rounded-lg bg-accent p-1.5 text-accent-foreground">
        <Handshake className="h-5 w-5" />
      </div>
      <span className="font-headline text-xl font-bold text-accent">
        tasKey
      </span>
    </div>
  );
}
