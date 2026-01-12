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
import { 
    User, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    getMultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
} from 'firebase/auth';
import { MfaDialog } from './mfa-dialog';
import type { MultiFactorResolver, MultiFactorError } from 'firebase/auth';

const testAccounts = [
  { role: 'Customer', email: 'customer@taskey.app', password: 'password123' },
  { role: 'Helper', email: 'helper@taskey.app', password: 'password123' },
];

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authAction, setAuthAction] = useState<'signIn' | 'signUp'>('signIn');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [emailForLink, setEmailForLink] = useState('');
  const [emailLinkSent, setEmailLinkSent] = useState(false);

  // MFA State
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);


  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Effect to handle user profile checking and redirection after login
  useEffect(() => {
    const checkUserProfile = async (currentUser: User) => {
        const db = getFirestore();
        const helperDocRef = doc(db, 'helpers', currentUser.uid);
        const customerDocRef = doc(db, 'customers', currentUser.uid);
        
        const [helperDoc, customerDoc] = await Promise.all([
          getDoc(helperDocRef),
          getDoc(customerDocRef)
        ]);

        if (helperDoc.exists() || customerDoc.exists()) {
            router.push('/dashboard');
        } else {
            router.push('/onboarding/create-profile');
        }
    };

     // Effect to handle email link sign-in on page load
    const handleEmailLinkSignIn = async () => {
      if (auth && isSignInWithEmailLink(auth, window.location.href)) {
        let savedEmail = window.localStorage.getItem('emailForSignIn');
        if (!savedEmail) {
            savedEmail = window.prompt('Please provide your email for confirmation');
        }
        if (savedEmail) {
            setIsSubmitting(true);
            try {
                await signInWithEmailLink(auth, savedEmail, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
            } catch (error: any) {
                toast({ variant: "destructive", title: "Sign-in Failed", description: error.message });
            } finally {
                setIsSubmitting(false);
            }
        }
      }
    }
    handleEmailLinkSignIn();

    if (!isUserLoading && user) {
        checkUserProfile(user);
    }
  }, [user, isUserLoading, router, auth, toast]);

  // Setup reCAPTCHA for phone authentication
  useEffect(() => {
    if (!auth) return;
    if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        });
    }
  }, [auth]);

  const handleEmailPasswordAuth = async () => {
    if (!auth) return;
    if (!email || !password) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please enter both email and password." });
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
        if (error.code === 'auth/multi-factor-auth-required') {
            const resolver = getMultiFactorResolver(auth, error as MultiFactorError);
            setMfaResolver(resolver);
        } else {
            toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneAuth = async () => {
      if (!auth || !phoneNumber) return;
      setIsSubmitting(true);
      try {
          const appVerifier = (window as any).recaptchaVerifier;
          const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
          setConfirmationResult(result);
          toast({ title: "OTP Sent", description: `A code has been sent to ${phoneNumber}.` });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Phone Sign-in Failed", description: error.message });
           if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.render().then((widgetId: any) => {
              grecaptcha.reset(widgetId);
            });
          }
      } finally {
          setIsSubmitting(false);
      }
  }

  const handleOtpConfirm = async () => {
      if (!confirmationResult || !otp) return;
      setIsSubmitting(true);
      try {
          await confirmationResult.confirm(otp);
      } catch (error: any) {
          toast({ variant: "destructive", title: "OTP Confirmation Failed", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  }

    const handleSendSignInLink = async () => {
        if (!auth || !emailForLink) return;
        setIsSubmitting(true);

        const actionCodeSettings = {
            url: window.location.origin + '/login', // URL to redirect back to
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, emailForLink, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', emailForLink);
            setEmailLinkSent(true);
            toast({ title: "Check your email", description: `A sign-in link has been sent to ${emailForLink}.` });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Could not send link", description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

  const setTestCredentials = (account: typeof testAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  }

  if (isUserLoading || user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <p className="font-semibold">Loading Dashboard...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
        </div>
    );
  }
  
  if (mfaResolver) {
    return <MfaDialog resolver={mfaResolver} />;
  }

  return (
    <div className="w-full max-w-sm">
        <div id="recaptcha-container" className="hidden" />
        <Tabs defaultValue="email-password" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email-password">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="passwordless">Magic Link</TabsTrigger>
            </TabsList>
            <TabsContent value="email-password">
                <Tabs defaultValue="signIn" onValueChange={(value) => setAuthAction(value as 'signIn' | 'signUp')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signIn">Sign In</TabsTrigger>
                        <TabsTrigger value="signUp">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signIn">
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-2xl">Login</CardTitle>
                                <CardDescription>Enter your email and password to access your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="email-signin">Email</Label><Input id="email-signin" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}/></div>
                                <div className="space-y-2"><Label htmlFor="password-signin">Password</Label><Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting}/></div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleEmailPasswordAuth} disabled={isSubmitting}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signUp">
                         <Card>
                            <CardHeader><CardTitle className="text-2xl">Register</CardTitle><CardDescription>Create a new account with your email and password.</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="email-signup">Email</Label><Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}/></div>
                                <div className="space-y-2"><Label htmlFor="password-signup">Password</Label><Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting}/></div>
                            </CardContent>
                            <CardFooter><Button className="w-full" onClick={handleEmailPasswordAuth} disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Create Account'}</Button></CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </TabsContent>
            <TabsContent value="phone">
                 <Card>
                    <CardHeader><CardTitle className="text-2xl">Sign In with Phone</CardTitle><CardDescription>Enter your phone number to receive a verification code.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        {!confirmationResult ? (
                            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" placeholder="+255 712 345 678" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isSubmitting}/></div>
                        ) : (
                            <div className="space-y-2"><Label htmlFor="otp">Verification Code</Label><Input id="otp" type="text" placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isSubmitting}/></div>
                        )}
                    </CardContent>
                    <CardFooter>
                        {!confirmationResult ? (
                            <Button className="w-full" onClick={handlePhoneAuth} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Code'}</Button>
                        ) : (
                             <Button className="w-full" onClick={handleOtpConfirm} disabled={isSubmitting}>{isSubmitting ? 'Verifying...' : 'Confirm & Sign In'}</Button>
                        )}
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="passwordless">
                 <Card>
                    <CardHeader><CardTitle className="text-2xl">Passwordless Sign-In</CardTitle><CardDescription>{emailLinkSent ? "Check your inbox for the magic link!" : "Enter your email to receive a sign-in link."}</CardDescription></CardHeader>
                     {!emailLinkSent && (
                        <>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="email-link">Email</Label><Input id="email-link" type="email" placeholder="m@example.com" required value={emailForLink} onChange={(e) => setEmailForLink(e.target.value)} disabled={isSubmitting}/></div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleSendSignInLink} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Sign-In Link'}</Button>
                        </CardFooter>
                        </>
                     )}
                </Card>
            </TabsContent>
        </Tabs>
        
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-sm">Test Accounts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
                {testAccounts.map(acc => (
                    <Button key={acc.role} variant="outline" size="sm" onClick={() => setTestCredentials(acc)}>
                       Log in as {acc.role}
                    </Button>
                ))}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">Note: If registering for the first time, use the "Register" tab. The password for both accounts is `password123`.</p>
            </CardFooter>
        </Card>
    </div>
  );
}
