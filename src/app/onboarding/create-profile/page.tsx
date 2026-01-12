'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { taskCategories } from '@/lib/data';
import type { Helper } from '@/lib/data';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const testAccounts = {
  'customer@taskey.app': {
    role: 'customer',
    fullName: 'Aisha Customer',
    aboutMe: '',
    serviceAreas: '',
  },
  'helper@taskey.app': {
    role: 'helper',
    fullName: 'Baraka Helper',
    serviceCategories: ['Cleaning', 'Laundry'],
    serviceAreas: 'Masaki, Msasani',
    aboutMe: 'Reliable and detail-oriented helper with 3+ years of experience in home cleaning and laundry services. I take pride in my work and always ensure customer satisfaction.',
  }
};


const profileFormSchema = z.object({
  role: z.enum(['helper', 'customer'], { required_error: 'You must select a role.' }),
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  serviceCategories: z.array(z.string()).optional(),
  serviceAreas: z.string().optional(),
  aboutMe: z.string().optional(),
}).refine(data => {
    if (data.role === 'helper') {
        return data.serviceCategories && data.serviceCategories.length > 0;
    }
    return true;
}, {
    message: 'You have to select at least one service category.',
    path: ['serviceCategories'],
}).refine(data => {
    if (data.role === 'helper') {
        return data.serviceAreas && data.serviceAreas.length > 3;
    }
    return true;
}, {
    message: 'Please enter at least one service area.',
    path: ['serviceAreas'],
}).refine(data => {
    if (data.role === 'helper') {
        return data.aboutMe && data.aboutMe.length > 10;
    }
    return true;
}, {
    message: 'Please tell us a little about yourself (at least 10 characters).',
    path: ['aboutMe'],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultAvatar = useMemoFirebase(() => PlaceHolderImages.find(p => p.id === 'avatar-1'), []);
  const defaultHelperAvatar = useMemoFirebase(() => PlaceHolderImages.find(p => p.id === 'avatar-2'), []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        role: 'customer',
        fullName: '',
        serviceCategories: [],
        serviceAreas: '',
        aboutMe: '',
    }
  });

  const selectedRole = form.watch('role');

  useEffect(() => {
    // Set role from query param
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'helper' || roleFromQuery === 'customer') {
      form.setValue('role', roleFromQuery);
    }
    
    // Pre-fill form if it's a test user
    if (user?.email && user.email in testAccounts) {
      const testData = testAccounts[user.email as keyof typeof testAccounts];
      form.reset(testData);
    }
  }, [searchParams, form, user]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated or system not ready.' });
        return;
    }
    
    setIsSubmitting(true);

    try {
        if (data.role === 'helper') {
            if (!defaultHelperAvatar) throw new Error("Default avatar not found");

            // Calculate profile completion
            const missing: Array<'profilePhoto' | 'serviceCategories' | 'serviceAreas' | 'aboutMe'> = [];
            // We assume a photo is always available for now, but this shows how to check
            if (!data.serviceCategories || data.serviceCategories.length === 0) missing.push('serviceCategories');
            if (!data.serviceAreas || data.serviceAreas.trim().length < 3) missing.push('serviceAreas');
            if (!data.aboutMe || data.aboutMe.trim().length < 10) missing.push('aboutMe');
            
            const completionPercent = Math.round(( (4 - missing.length) / 4) * 100);

            const helperData: Helper = {
                id: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                fullName: data.fullName,
                profilePhotoUrl: defaultHelperAvatar.imageUrl,
                serviceCategories: data.serviceCategories || [],
                serviceAreas: data.serviceAreas?.split(',').map(s => s.trim()) || [],
                aboutMe: data.aboutMe || '',
                isAvailable: true, // Default to available
                memberSince: serverTimestamp() as Timestamp,
                
                // Lifecycle fields
                verificationStatus: 'PENDING',
                lifecycleStage: completionPercent < 100 ? 'PROFILE_INCOMPLETE' : 'PENDING_VERIFICATION',
                profileCompletion: {
                  percent: completionPercent,
                  missing: missing,
                },
                stats: {
                  jobsCompleted: 0,
                  jobsCancelled: 0,
                  ratingAvg: 0,
                  reliabilityLevel: 'GREEN',
                },
                walletSummary: {
                  earningsThisWeek: 0,
                  earningsThisMonth: 0,
                  currency: 'TZS',
                },

                // Legacy fields (set to default/empty)
                reliabilityIndicator: 'Good',
            };
            await setDoc(doc(firestore, 'helpers', user.uid), helperData);
        } else {
            if (!defaultAvatar) throw new Error("Default avatar not found");
            const customerData = {
                id: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                fullName: data.fullName,
                profilePhotoUrl: defaultAvatar.imageUrl,
                rating: 4.0,
                memberSince: serverTimestamp(),
            };
            await setDoc(doc(firestore, 'customers', user.uid), customerData);
        }

        toast({ title: 'Profile Created!', description: "Welcome to tasKey. You're all set up." });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Error creating profile: ", error);
        toast({ variant: 'destructive', title: 'Profile Creation Failed', description: error.message });
        setIsSubmitting(false);
    }
  };
  
  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Your Profile</CardTitle>
          <CardDescription>
            Complete these last few steps to get started with tasKey. Your information has been pre-filled for this test.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                 <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>What do you want to do on tasKey?</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="customer" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Post tasks and find help
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="helper" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                 Earn money as a helper
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Juma Hamisi" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedRole === 'helper' && (
                    <>
                        <FormField
                            control={form.control}
                            name="serviceCategories"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Service Categories</FormLabel>
                                    <FormDescription>
                                        Select the types of tasks you are skilled in.
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {taskCategories.map((item) => (
                                        <FormField
                                        key={item}
                                        control={form.control}
                                        name="serviceCategories"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value ?? []), item])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== item
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {item}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceAreas"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Service Areas</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Masaki, Msasani, Mbezi Beach" {...field} />
                                </FormControl>
                                <FormDescription>
                                    List the neighborhoods or wards you can work in, separated by commas.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="aboutMe"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>About Me</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell customers a bit about your experience and why you're a great helper."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving Profile...' : 'Complete Profile & View Dashboard'}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
