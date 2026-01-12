'use client';

import { resetPasswordRequest } from '@/api/auth/requests';
import { TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { HStack, VStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type ResetPasswordSchema, resetPasswordSchema } from './libs/validators';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetComplete, setResetComplete] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: resetPassword, isLoading } = useMutation(resetPasswordRequest);

  const handleSubmit: SubmitHandler<ResetPasswordSchema> = async (formData) => {
    if (!token) {
      toast.error('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
      return;
    }

    resetPassword(
      {
        newPassword: formData.newPassword,
        token,
      },
      {
        onSuccess: () => {
          setResetComplete(true);
          toast.success('Bạn đã đặt lại mật khẩu thành công!');
        },
        onError: onMutateError,
      }
    );
  };

  if (!token) {
    return (
      <VStack justify="center" align="center" className="mx-2 h-[100vh]">
        <div className="-z-10 fixed inset-0 bg-cover bg-repeat opacity-65" style={{ backgroundImage: "url('/images/background.png')" }}>
          <div className="h-full w-full" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}></div>
        </div>

        <VStack className="w-full max-w-[450px] rounded-lg border border-grey-100 px-6 py-6 shadow-card-2 md:px-8" spacing={16}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-center font-semibold text-2xl">Đường dẫn đặt lại mật khẩu không hợp lệ</h1>
          <p className="text-center text-gray-600">
            Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một đường dẫn đặt lại mật khẩu mới.
          </p>
          <Button onClick={() => router.push(ROUTER.FORGOT_PASSWORD)} className="w-full rounded-full">
            Yêu cầu đường dẫn đặt lại mật khẩu mới
          </Button>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack justify="center" align="center" className="mx-2 h-[100vh]">
      <div className="-z-10 fixed inset-0 bg-cover bg-repeat opacity-65" style={{ backgroundImage: "url('/images/background.png')" }}>
        <div className="h-full w-full" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}></div>
      </div>

      <HStack className="mb-3" pos="center">
        <Image width={150} height={92} src="/images/logo.png" alt="logo" className="h-auto w-[14rem]" />
      </HStack>
      <VStack className="w-full max-w-[450px] rounded-lg border border-grey-100 px-6 py-6 shadow-card-2 md:px-8" spacing={16}>
        <h1 className="mb-4 text-center font-semibold text-2xl md:text-3xl">Đặt lại mật khẩu</h1>

        {!resetComplete ? (
          <>
            <p className="text-center text-gray-600">Vui lòng nhập mật khẩu mới của bạn.</p>

            <FormWrapper form={form} onSubmit={handleSubmit}>
              <VStack spacing={16}>
                <TextField
                  required
                  fullWidth
                  control={form.control}
                  name="newPassword"
                  label="Mật khẩu mới"
                  placeholder="Mời nhập mật khẩu mới"
                  type="password"
                />
                <TextField
                  required
                  fullWidth
                  control={form.control}
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  placeholder="Mời nhập lại mật khẩu mới"
                  type="password"
                />
              </VStack>

              <HStack pos="center">
                <Button type="submit" className="mt-8 mb-2 w-full rounded-full px-10" loading={isLoading}>
                  Đặt lại mật khẩu
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
            <p className="text-center text-gray-600">Bạn đã đặt lại mật khẩu thành công.</p>
            <Button onClick={() => router.push(ROUTER.SIGN_IN)} className="mt-4 w-full rounded-full">
              Đăng nhập
            </Button>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default ResetPasswordPage;
