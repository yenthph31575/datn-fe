'use client';

import { forgotPasswordRequest } from '@/api/auth/requests';
import { TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { HStack, VStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type ForgotPasswordSchema, forgotPasswordSchema } from './libs/validators';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: forgotPassword, isLoading } = useMutation(forgotPasswordRequest);

  const handleSubmit: SubmitHandler<ForgotPasswordSchema> = async (formData) => {
    forgotPassword(formData, {
      onSuccess: () => {
        setEmailSent(true);
        toast.success('Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra email của bạn.');
      },
      onError: onMutateError,
    });
  };

  return (
    <VStack justify="center" align="center" className="mx-2 h-[100vh]">
      <div className="-z-10 fixed inset-0 bg-cover bg-repeat opacity-65" style={{ backgroundImage: "url('/images/background.png')" }}>
        <div className="h-full w-full" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}></div>
      </div>

      <HStack className="mb-3" pos="center">
        <Image width={150} height={92} src="/images/logo.png" alt="logo" className="h-auto w-[14rem]" />
      </HStack>
      <VStack className="w-full max-w-[450px] rounded-lg border border-grey-100 px-6 py-6 shadow-card-2 md:px-8" spacing={16}>
        <h1 className="mb-4 text-center font-semibold text-2xl md:text-3xl">Quên mật khẩu?</h1>

        {!emailSent ? (
          <>
            <p className="text-center text-gray-600">Vui lòng nhập địa chỉ email của bạn để đặt lại mật khẩu.</p>

            <FormWrapper form={form} onSubmit={handleSubmit}>
              <VStack spacing={16}>
                <TextField required fullWidth control={form.control} name="email" label="Email" placeholder="Mời nhập email address" />
              </VStack>

              <HStack pos="center">
                <Button type="submit" className="mt-8 mb-2 w-full rounded-full px-10" loading={isLoading}>
                  Gửi
                </Button>
              </HStack>
            </FormWrapper>
          </>
        ) : (
          <VStack spacing={16} className="items-center">
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
            <p className="text-center text-gray-600">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra email của bạn.
            </p>
            <Button onClick={() => router.push(ROUTER.SIGN_IN)} className="mt-4 w-full rounded-full">
              Đăng nhập
            </Button>
          </VStack>
        )}

        <div className="text-center text-sm">
          Bạn nhớ mật khẩu của mình?{' '}
          <Link href={ROUTER.SIGN_IN} className="font-semibold text-primary-500 hover:text-primary-600">
            Đăng nhập
          </Link>
        </div>
      </VStack>
    </VStack>
  );
};

export default ForgotPasswordPage;
