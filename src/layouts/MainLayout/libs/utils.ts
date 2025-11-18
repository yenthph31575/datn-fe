import { AVATAR_PROFILE_RANDOMS } from '@/libs/const';

export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATAR_PROFILE_RANDOMS.length);
  return AVATAR_PROFILE_RANDOMS[randomIndex];
};
