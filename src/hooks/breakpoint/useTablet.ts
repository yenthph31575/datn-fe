import { useMediaQuery } from '@mantine/hooks';

const useTablet = () => {
  return useMediaQuery('(max-width: 1024px)');
};

export default useTablet;
