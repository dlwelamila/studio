'use client';

import { useState } from 'react';
import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  type MultiFactorResolver,
} from 'firebase/auth';

import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MfaDialogProps = {
  resolver: MultiFactorResolver;
};

export function MfaDialog({ resolver }: MfaDialogProps) {
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hints = resolver.hints;
  const phoneHint = hints.find(h => h.factorId === PhoneMultiFactorGenerator.FACTOR_ID);

  if (!phoneHint) {
    return <p>No supported second factor found.</p>;
  }

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    try {
      const phoneAuthCredential = PhoneAuthProvider.credential(
        (resolver.session as any).verificationId,
        otp
      );
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
      await resolver.resolveSignIn(multiFactorAssertion);
      // The main user observer will now redirect to the dashboard
      toast({ title: 'Sign-in successful!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'MFA Failed',
        description: 'The code was incorrect. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          A verification code has been sent to your phone number ending in {phoneHint.displayName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="mfa-otp">Verification Code</Label>
          <Input
            id="mfa-otp"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVerifyOtp} disabled={isSubmitting || otp.length < 6} className="w-full">
          {isSubmitting ? 'Verifying...' : 'Verify and Sign In'}
        </Button>
      </CardFooter>
    </Card>
  );
}
