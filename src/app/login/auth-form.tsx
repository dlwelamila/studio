'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // If the user is logged in and loading is complete, redirect to dashboard.
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async (action: 'signIn' | 'signUp') => {
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter both email and password.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (action === 'signIn') {
        initiateEmailSignIn(auth, email, password);
      } else {
        initiateEmailSignUp(auth, email, password);
      }
      // The onAuthStateChanged listener in FirebaseProvider will handle redirection.
      // We don't need to await here because we want a non-blocking UI.
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setIsSubmitting(false);
    }
    // We don't set isSubmitting to false here because we expect a page redirect.
    // If the redirect fails, the user is still on the page and can try again.
  };

  if (isUserLoading || user) {
    // Display a loading state or nothing while checking auth and redirecting
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
                Sign In
        </Button>
        <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleAuth('signUp')}
            disabled={isSubmitting}>
                Register
        </Button>
      </CardFooter>
    </Card>
  );
}
