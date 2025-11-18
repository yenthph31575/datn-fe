'use client';
import { useUserLogin } from '@/hooks/useUserLogin';
import MainLayout from '@/layouts/MainLayout';
import { ROUTER } from '@/libs/router';
import type { FCC } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const layout: FCC = ({ children }) => {
  // const { isLoggedIn, isFetching } = useUserLogin();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoggedIn && !isFetching) router.replace(ROUTER.SIGN_IN);
  // }, [isLoggedIn, isFetching]);

  // if (!isLoggedIn && !isFetching) return <></>;
  return <MainLayout>{children}</MainLayout>;
};

export default layout;
