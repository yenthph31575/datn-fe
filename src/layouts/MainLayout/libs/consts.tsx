import { ROUTER } from '@/libs/router';

import { Icons } from '@/assets/icons';

export const sidebars = [
  {
    icon: <Icons.home />,
    title: 'Dashboard',
    link: ROUTER.HOME,
    iconActive: null,
  },

  // {
  //   line: true,
  // },
  // {
  //   icon: <Icons.consortium />,
  //   iconActive: <Icons.consortiumActive />,
  //   title: 'Consortium',
  //   link: ROUTE.CONSORTIUM,
  //   access: [IPermissions['SUPER-ADMIN_ADMIN'], IPermissions.ADMIN_ADMIN, IPermissions['GLOBAL-SUPER-ADMIN_ADMIN']],
  // },
  // {
  //   icon: <Icons.mbPage />,
  //   title: 'M & B',
  //   link: ROUTE['CRON-JOB'],
  //   access: [IPermissions['SUPER-ADMIN_ADMIN'], IPermissions['GLOBAL-SUPER-ADMIN_ADMIN']],
  // },
  // {
  //   icon: <Icons.account />,
  //   title: 'Accounts',
  //   link: ROUTE.ADMIN_USER_MANAGEMENT,
  //   access: [IPermissions['SUPER-ADMIN_ADMIN'], IPermissions['GLOBAL-SUPER-ADMIN_ADMIN']],
  // },
  // {
  //   icon: <Icons.developerZone />,
  //   title: 'Developer Zone',
  //   link: ROUTE.ADMIN_DEVELOPER_ZONE,
  //   access: [IPermissions['GLOBAL-SUPER-ADMIN_ADMIN']],
  // },
];
