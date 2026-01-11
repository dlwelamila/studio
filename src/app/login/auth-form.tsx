'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authAction, setAuthAction] = useState<'signIn' | 'signUp' | null>(null);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserProfile = async (currentUser: User) => {
        const db = getFirestore();
        // Check both collections. In a more complex app, you might have a 'users' collection with a role field.
        const helperDocRef = doc(db, 'helpers', currentUser.uid);
        const customerDocRef = doc(db, 'customers', currentUser.uid);
        
        const helperDoc = await getDoc(helperDocRef);
        const customerDoc = await getDoc(customerDocRef);

        if (helperDoc.exists() || customerDoc.exists()) {
            router.push('/dashboard');
        } else {
             if (authAction === 'signUp') {
                router.push('/onboarding/create-profile');
            } else {
                router.push('/onboarding/create-profile');
            }
        }
    };
    
    if (!isUserLoading && user) {
        checkUserProfile(user);
    }
  }, [user, isUserLoading, router, authAction]);

  const handleAuth = async (action: 'signIn' | 'signUp') => {
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Auth service not available',
        });
        return;
    }
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter both email and password.',
      });
      return;
    }

    setIsSubmitting(true);
    setAuthAction(action);

    try {
      if (action === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // The useEffect will handle redirection on successful auth.
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setIsSubmitting(false);
        setAuthAction(null);
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login or Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to login to your account or create a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
            className="w-full" 
            onClick={() => handleAuth('signIn')}
            disabled={isSubmitting}>
                {isSubmitting && authAction === 'signIn' ? 'Signing In...' : 'Sign In'}
        </Button>
        <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleAuth('signUp')}
            disabled={isSubmitting}>
                {isSubmitting && authAction === 'signUp' ? 'Registering...' : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  );
}
