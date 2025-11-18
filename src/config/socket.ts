import { env } from '@/libs/const';
import { getCookie } from 'cookies-next';
import { io } from 'socket.io-client';

const accessToken = getCookie(`access_token`);

export const socket = io(env.APP_SOCKET_URL, {
  autoConnect: true,
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  path: '/wss/socket.io',
});

export enum EEventSocket {
  COMMENT = 'comment',
  LIVE_BATTLE = 'live_battle',
  LIVE_BATTLE_LOADING = 'live_battle_loading',
  DEBATE_RESOLVED = 'DebateResolved',
  DEBATE_CREATED = 'DebateCreated',
  DEBATE_UPDATED = 'DebateUpdated',
  DEBATE_DELETED = 'DebateDeleted',
  BET_PLACED = 'BetPlaced',
  USER_CLAIMED = 'UserClaimed',
}

export const SOCKET_LISTENER_EVENT = {
  COMMENT: 'comment',
};
