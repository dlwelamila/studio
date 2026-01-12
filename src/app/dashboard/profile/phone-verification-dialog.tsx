'use client';

import { useState, useEffect } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';

import { useAuth } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentReference } from 'firebase/firestore';

type PhoneVerificationDialogProps = {
  phoneNumber: string;
  userDocRef: DocumentReference | null;
  onSuccess: () => void;
};

export function PhoneVerificationDialog({ phoneNumber, userDocRef, onSuccess }: PhoneVerificationDialogProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const handleSendOtp = async () => {
    if (!auth || !phoneNumber) return;
    setIsSubmitting(true);
    try {
      // Use a dummy verifier for testing without a visible reCAPTCHA
      const appVerifier = {
          type: 'recaptcha',
          verify: () => Promise.resolve('test-recaptcha-token')
      } as any;

      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast({
        title: 'Verification Code Sent',
        description: `An SMS has been sent to ${phoneNumber}. (For testing, use code 123456).`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send Code',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConfirmOtp = async () => {
    if (!confirmationResult || !otp || !userDocRef) return;
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(otp);
      
      updateDocumentNonBlocking(userDocRef, { phoneVerified: true });
      
      toast({
        title: 'Phone Number Verified!',
        description: 'Your account is now fully active.',
      });
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'The code was incorrect. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto">Verify Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            {confirmationResult
              ? 'Enter the 6-digit code sent to your phone.'
              : `We will send a one-time verification code to ${phoneNumber}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!confirmationResult ? (
             <p className="text-sm text-muted-foreground">Click the button below to receive your code. Standard SMS rates may apply.</p>
          ) : (
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
          )}
        </div>
        <DialogFooter>
          {!confirmationResult ? (
            <Button onClick={handleSendOtp} disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Sending...' : 'Send Verification Code'}
            </Button>
          ) : (
            <Button onClick={handleConfirmOtp} disabled={isSubmitting || otp.length < 6} className="w-full">
              {isSubmitting ? 'Verifying...' : 'Confirm & Verify'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
