'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, serverTimestamp } from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Task } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { DialogClose } from '@/components/ui/dialog';


const offerFormSchema = z.object({
    price: z.coerce.number().positive({ message: "Please enter a valid price." }),
    etaAt: z.date({ required_error: "Please select an arrival date and time." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters long."})
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

type OfferFormProps = {
    task: Task;
}

export function OfferForm({ task }: OfferFormProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<OfferFormValues>({
        resolver: zodResolver(offerFormSchema),
        defaultValues: {
            price: task.budget.min > 0 ? task.budget.min : undefined,
            message: '',
        }
    });

    const handleMakeOffer = (data: OfferFormValues) => {
        if (!user || !firestore || !task) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make an offer.' });
            return;
        }

        const offerData = {
            taskId: task.id,
            helperId: user.uid,
            price: data.price,
            etaAt: data.etaAt,
            message: data.message,
            status: 'SUBMITTED',
            createdAt: serverTimestamp(),
        };

        const offersCollection = collection(firestore, 'tasks', task.id, 'offers');
        addDocumentNonBlocking(offersCollection, offerData);
        toast({ title: 'Offer Submitted!', description: 'The customer has been notified of your offer.' });
        form.reset({
            price: task.budget.min > 0 ? task.budget.min : undefined,
            etaAt: undefined,
            message: ''
        });
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleMakeOffer)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your Price (TZS)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 25,000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="etaAt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Promised Arrival Time</FormLabel>
                            <FormControl>
                                <DateTimePicker date={field.value} setDate={field.onChange} />
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
                        <FormLabel>Message to Customer</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Explain why you're a good fit for this task." className="min-h-24" {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Formal Offer'}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">Done</Button>
                </DialogClose>
            </form>
        </Form>
    )
}
