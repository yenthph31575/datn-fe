import { cn } from '@/libs/common';

interface Props {
  loading?: boolean;
}

const FullScreenLoading = ({ loading }: Props) => {
  if (!loading) return null;
  return (
    <div id="" className={cn('fixed inset-0 z-50 flex items-center justify-center bg-background-light/90')}>
      <img src="/images/var-loading.gif" width={600} height={600} alt="loading" />
    </div>
  );
};

export default FullScreenLoading;
