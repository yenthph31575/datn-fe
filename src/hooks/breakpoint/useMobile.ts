import { useMediaQuery } from '@mantine/hooks';

const useMobile = () => {
  return useMediaQuery('(max-width: 36rem)');
};

export default useMobile;
