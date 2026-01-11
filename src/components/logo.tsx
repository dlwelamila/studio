import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 25"
      className={cn('h-6 w-auto text-primary', className)}
      {...props}
    >
      <title>tasKey Logo</title>
      <text
        x="0"
        y="18"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="24"
        fontWeight="bold"
        className="fill-current text-accent dark:text-primary"
      >
        tasKey
      </text>
    </svg>
  );
}
