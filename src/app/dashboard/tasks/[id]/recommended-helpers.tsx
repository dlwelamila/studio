'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import type { Task, Helper } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { recommendHelpersForTask } from '@/ai/flows/recommend-helpers-for-task';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


type RecommendedHelpersProps = {
  task: Task;
};

export function RecommendedHelpers({ task }: RecommendedHelpersProps) {
  const [recommended, setRecommended] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    const getRecommendations = async () => {
      if (!firestore) return;
      setLoading(true);
      try {
        const result = await recommendHelpersForTask({
          taskDescription: task.description,
          taskLocation: task.area,
          customerRating: 4.5, // Mock customer rating
        });
        
        if (result.recommendedHelpers && result.recommendedHelpers.length > 0) {
            const helpersQuery = query(collection(firestore, 'helpers'), where('id', 'in', result.recommendedHelpers));
            const querySnapshot = await getDocs(helpersQuery);
            const fetchedHelpers: Helper[] = [];
            querySnapshot.forEach(doc => {
                fetchedHelpers.push(doc.data() as Helper);
            });
            setRecommended(fetchedHelpers);
        }
        
      } catch (error) {
        console.error('Failed to get recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (task && firestore) {
        // Temporarily disable while AI functionality is being debugged.
        // In a real scenario, you'd want this active.
        // getRecommendations(); 
        setLoading(false);
    }
  }, [task, firestore]);

  if (!task) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Recommended Helpers</span>
        </CardTitle>
        <CardDescription>
          Based on your task, here are some top-rated helpers we think would be a great fit.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))
        ) : recommended.length > 0 ? (
            recommended.map(helper => (
                <div key={helper.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                     <div className="flex items-center gap-4">
                        <Image
                            alt="Helper avatar"
                            className="rounded-full"
                            height={48}
                            src={helper.profilePhotoUrl}
                            style={{ aspectRatio: '48/48', objectFit: 'cover' }}
                            width={48}
                        />
                        <div className="grid gap-1">
                        <div className="font-semibold">{helper.fullName}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-0.5">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span>{helper.rating}</span>
                            </div>
                            <span>&middot;</span>
                            <div>{helper.serviceAreas[0]}</div>
                        </div>
                        </div>
                    </div>
                    <Button size="sm" variant="outline">Invite to Offer</Button>
                </div>
            ))
        ) : (
            <p className="text-center text-sm text-muted-foreground py-4">AI recommendations will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
