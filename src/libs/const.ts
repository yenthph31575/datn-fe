import type { Address } from 'viem';

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://staging.og-battle-ai.var-meta.com',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.staging.flofin.myrcvr.com',
  APP_SOCKET_URL: process.env.NEXT_PUBLIC_APP_SOCKET_URL ?? '',
  TWITTER_CLIENT_ID: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID ?? '',
  TWITTER_CLIENT_SECRET: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET ?? '',
  SIGN_MESSAGE_WALLET: process.env.NEXT_PUBLIC_SIGN_MESSAGE_WALLET ?? '',
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 16600,
  CHAIN_RPC_URL: process.env.NEXT_PUBLIC_CHAIN_RPC_URL ?? 'https://evmrpc-testnet.0g.ai',
};

export const LAST_MONTH = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);

export const isServer = typeof window === 'undefined';
export const useTestnet = process.env.NEXT_PUBLIC_USE_TESTNET! ? process.env.NEXT_PUBLIC_USE_TESTNET === 'true' : true;

export const AVATAR_PROFILE_RANDOMS = [
  'https://battle-of-ai-agents.s3.ap-southeast-1.amazonaws.com/dev/profile-images/goat.png',
  'https://battle-of-ai-agents.s3.ap-southeast-1.amazonaws.com/dev/profile-images/dog.png',
];

export const SMART_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS ??
  '0xA1ef2b6d1B4cd00324Cc8BFD4F6B521418aCf1cA') as Address;
