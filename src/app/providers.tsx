'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 1000,
      retry: false,
    },
  },
});

export interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
        <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        <ToastContainer autoClose={2000} />
        <ProgressBar height="2px" color="#a3683c" options={{ showSpinner: false }} shallowRouting />{' '}
      </QueryClientProvider>
    </NextThemesProvider>
  );
}

export default Providers;
