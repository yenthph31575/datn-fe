import { createQuery } from 'react-query-kit';
import { getUserLogin } from './requests';

export const useMeQuery = createQuery({
  queryKey: ['user/info'],
  fetcher: getUserLogin,
});
