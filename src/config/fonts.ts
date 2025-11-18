import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';

import { Open_Sans, Orbitron, Poppins } from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const fontMono = localFont({
  src: '../assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const fontMetropolis = localFont({
  src: [
    {
      path: '../assets/fonts/metropolis/Metropolis-Thin.otf',
      weight: '100',
    },
    {
      path: '../assets/fonts/metropolis/Metropolis-Regular.otf',
      weight: '400',
    },
    {
      path: '../assets/fonts/metropolis/Metropolis-Medium.otf',
      weight: '500',
    },
    {
      path: '../assets/fonts/metropolis/Metropolis-Bold.otf',
      weight: '700',
    },
  ],
  variable: '--font-metropolis',
  style: 'normal',
  display: 'swap',
});

export const fontOrbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['900', '400', '500', '600', '700', '800'],
});

export const fontPoppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['900', '400', '500', '600', '700', '800'],
});
