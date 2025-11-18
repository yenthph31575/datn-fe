import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

const config: Config = {
  darkMode: 'class',
  content: [
    './.storybook/welcome.stories.mdx',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/assets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        serif: ['var(--font-serif)', ...fontFamily.serif],
        openSans: ['var(--font-open-sans)'],
        orbitron: ['var(--font-orbitron)'],
        poppins: ['var(--font-poppins)'],
      },
      spacing: {
        17: '68px',
        18: '72px',
      },
      boxShadow: {
        active: '0 0 80px 0 rgba(0, 0, 0, 0.10)',
        'card-2': '0px 4px 10px 0px rgba(0, 0, 0, 0.12)',
      },
      colors: {
        white: '#FFFFFF',
        success: {
          DEFAULT: '#ECFDF3',
          border: '#067647',
          text: '#027A48',
        },
        error: {
          DEFAULT: '#FEF3F2',
          border: '#FECDCA',
          text: '#B42318',
        },
        warning: {
          DEFAULT: '#FFFAEB',
          border: '#FEDF89',
          text: '#B54708',
        },
        info: {
          DEFAULT: '#EAFEFF',
          border: '#9EF4FF',
          text: '#03729B',
        },
        background: 'var(--background)',
        foreground: {
          DEFAULT: 'var(--foreground)',
        },
        input: 'var(--input)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: {
          DEFAULT: '#DBDBDB',
          primary: '#DBDBDB',
        },
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        table: {
          'header-bg': '#EDEDED',
          'header-text': '#666666',
          'row-hover': '#F0F0F0',
          'row-dragging': '#a8d68f',
          'row-highlight': '#F9F9F9',
          'footer-bg': '#bcd6ae',
        },
        primary: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc6cf',
          300: '#ff9ead',
          400: '#ff667d',
          500: '#fd3654',
          600: '#eb1737',
          700: '#cf102d',
          800: '#a31127',
          900: '#871526',
          950: '#4a050f',
        },
        grey: {
          50: '#F9F9F9',
          100: '#EAEAEA',
          200: '#c2c2c2',
          300: '#9b9b9b',
          400: '#767676',
          500: '#545454',
          600: '#333333',
          700: '#151515',
        },
        secondary: {
          100: '#dff4fe',
          200: '#6cdafa',
          300: '#3bb2d1',
          400: '#2b8aa2',
          500: '#1D6476',
          600: '#10404d',
          700: '#052027',
        },
        tertiary: {
          100: '#f6eefc',
          200: '#e0c1f6',
          300: '#ca8def',
          400: '#b651e6',
          500: '#8b30b2',
          600: '#5B1D76',
          700: '#2f0b3f',
        },
        quaternary: {
          100: '#f7d0cb',
          200: '#f19b8d',
          300: '#FF6347',
          400: '#ac482f',
          500: '#762F1D',
          600: '#44180d',
          700: '#230904',
        },
      },
      borderRadius: {},
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
