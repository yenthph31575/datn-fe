import { Icons } from '@/assets/icons';
import type { MIME_TYPE } from '@/libs/mime';

export const MAPPING_FILE_ICONS: Partial<Record<MIME_TYPE, React.ReactNode>> = {
  'application/pdf': <Icons.pdf />,
  'text/csv': <Icons.csv />,
  'application/vnd.ms-excel': <Icons.xlsx />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <Icons.xlsx />,
  'application/vnd.microsoft.portable-executable': <Icons.docs />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <Icons.docs />,
  'application/msword': <Icons.docs />,
};
