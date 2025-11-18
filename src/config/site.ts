import { env } from '@/libs/const';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: env.APP_URL,
  name: 'Kiddie KingDom',
  description: 'Kiddie KingDom',
  url: env.APP_URL,
  ogImage: `${env.APP_URL}/images/logo.png`,
  imageType: 'image/svg+xml',
  manifestSite: `${env.APP_URL}/site.webmanifest`,
  manifest: `${env.APP_URL}/manifest.json`,
};
