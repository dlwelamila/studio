'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { collection } from 'firebase/firestore';

import { useFirestore, useUser, serverTimestamp } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Task, Helper } from '@/lib/data';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

type ReviewFormProps = {
  task: Task;
  helper: Helper;
};

export function ReviewForm({ task, helper }: ReviewFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      feedback: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to leave a review.' });
      return;
    }

    const reviewData = {
      taskId: task.id,
      customerId: user.uid,
      helperId: helper.id,
      rating: data.rating,
      feedback: data.feedback,
      createdAt: serverTimestamp(),
    };
    
    const reviewsCollection = collection(firestore, 'feedbacks');
    addDocumentNonBlocking(reviewsCollection, reviewData);
    
    toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    form.reset();
    // In a real app, you'd likely trigger a re-fetch of the parent component's data
    // to hide this form. For now, the parent's logic handles this.
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Leave a Review for {helper.fullName}</CardTitle>
            <CardDescription>
              Your feedback is important for the community. Rate your experience and leave a comment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoverRating || field.value) >= star
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground/50'
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Share details of your experience with ${helper.fullName}...`}
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardContent>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
