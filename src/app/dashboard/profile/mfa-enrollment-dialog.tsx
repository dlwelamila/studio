'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MfaEnrollmentDialog() {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const isMfaEnrolled = multiFactor(user).enrolledFactors.some(
        (factor) => factor.factorId === PhoneMultiFactorGenerator.FACTOR_ID
      );
      setIsEnrolled(isMfaEnrolled);
    }

    if (!auth) return;
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [user, auth]);

  const handleEnroll = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const session = await multiFactor(user).getSession();
      const phoneInfoOptions = {
        phoneNumber: user.phoneNumber,
        session,
      };
      const phoneAuthProvider = new PhoneAuthProvider(auth!);
      const appVerifier = (window as any).recaptchaVerifier;
      const verId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
      setVerificationId(verId);
      toast({ title: 'Verification code sent', description: 'Enter the code to complete enrollment.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Enrollment Failed', description: error.message });
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpAndEnroll = async () => {
    if (!verificationId) return;
    setIsSubmitting(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, otp);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(user!).enroll(multiFactorAssertion, 'My Personal Phone');
      setIsEnrolled(true);
      setOpen(false);
      toast({ title: 'Success!', description: 'Two-factor authentication has been enabled.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Verification Failed', description: 'The code was incorrect.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnenroll = async () => {
    if (!user) return;
    const mfa = multiFactor(user);
    const phoneFactor = mfa.enrolledFactors.find(f => f.factorId === PhoneMultiFactorGenerator.FACTOR_ID);
    if (!phoneFactor) return;

    try {
      await mfa.unenroll(phoneFactor);
      setIsEnrolled(false);
      toast({ title: 'MFA Disabled', description: 'Two-factor authentication has been turned off.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Failed to Disable MFA', description: error.message });
    }
  };
  
  if (!user?.phoneNumber) {
    return <p className="text-sm text-muted-foreground">Your profile must have a verified phone number to enable two-factor authentication.</p>
  }

  if (isEnrolled) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">MFA is enabled on your account.</p>
        <Button variant="destructive" size="sm" onClick={handleUnenroll}>
          Disable
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Enable 2-Factor Auth</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {verificationId
              ? `Enter the code sent to ${user.phoneNumber}.`
              : 'A text message with a verification code will be sent to your phone.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {verificationId ? (
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          )}
        </div>
        <DialogFooter>
          {verificationId ? (
            <Button onClick={handleVerifyOtpAndEnroll} disabled={isSubmitting || otp.length < 6}>
              {isSubmitting ? 'Verifying...' : 'Verify & Enroll'}
            </Button>
          ) : (
            <Button onClick={handleEnroll} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Code'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
