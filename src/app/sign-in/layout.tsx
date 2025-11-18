'use client';
import { env } from '@/libs/const';
import type { FCC } from '@/types';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

const layout: FCC = ({ children }) => {
  return <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID as string}>{children}</GoogleOAuthProvider>;
};

export default layout;
