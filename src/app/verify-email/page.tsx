'use client';

import { verifyEmail } from '@/api/auth/requests';
import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/utilities';
import { ROUTER } from '@/libs/router';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const { mutate: verifyEmailMutation, isLoading } = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: () => {
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
    },
    onError: (error) => {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      toast.error('Failed to verify email. The link may be expired or invalid.');
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation(token);
    } else {
      setVerificationStatus('error');
    }
  }, [token]);

  return (
    <VStack className="min-h-screen bg-gray-50 p-4" spacing={16}>
      <VStack className="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow-md" spacing={16}>
        <h1 className="text-center font-bold text-2xl text-primary-600">Email Verification</h1>

        {verificationStatus === 'loading' && (
          <VStack spacing={8} className="items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-center text-gray-600">Verifying your email...</p>
          </VStack>
        )}

        {verificationStatus === 'success' && (
          <VStack spacing={8} className="items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-center text-gray-600">Your email has been successfully verified!</p>
          </VStack>
        )}

        {verificationStatus === 'error' && (
          <VStack spacing={8} className="items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-center text-gray-600">
              {!token ? 'No verification token provided.' : 'Failed to verify your email. The link may be expired or invalid.'}
            </p>
          </VStack>
        )}

        <HStack pos="center" spacing={8}>
          <Button onClick={() => router.push(ROUTER.SIGN_IN)} variant="default">
            Go to Login
          </Button>
          <Button onClick={() => router.push(ROUTER.HOME)} variant="outline">
            Go to Home
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
