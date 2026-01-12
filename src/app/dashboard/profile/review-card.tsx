'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Feedback, Customer } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type ReviewCardProps = {
  review: Feedback;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const firestore = useFirestore();

  const customerRef = useMemoFirebase(() => {
    if (!firestore || !review.customerId) return null;
    return doc(firestore, 'customers', review.customerId);
  }, [firestore, review.customerId]);

  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between">
        {isCustomerLoading || !customer ? (
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        ) : (
          <div className="flex items-center gap-3 mb-2">
            <Image
              src={customer.profilePhotoUrl}
              alt={customer.fullName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{customer.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {review.createdAt ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : ''}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < review.rating
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted-foreground'
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.feedback}</p>
    </div>
  );
}
