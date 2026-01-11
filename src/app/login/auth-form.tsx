'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authAction, setAuthAction] = useState<'signIn' | 'signUp'>('signIn');
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserProfile = async (currentUser: User) => {
        const db = getFirestore();
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

  const handleAuth = async () => {
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

    try {
      if (authAction === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setIsSubmitting(false);
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
    <Tabs defaultValue="signIn" className="w-full max-w-sm" onValueChange={(value) => setAuthAction(value as 'signIn' | 'signUp')}>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signIn">Sign In</TabsTrigger>
            <TabsTrigger value="signUp">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="signIn">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                    Enter your email and password to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input 
                        id="email-signin" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input 
                        id="password-signin" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full" 
                        onClick={handleAuth}
                        disabled={isSubmitting}>
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="signUp">
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                    Create a new account to get started with tasKey.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                        id="email-signup" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input 
                        id="password-signup" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full" 
                        onClick={handleAuth}
                        disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Create Account'}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
