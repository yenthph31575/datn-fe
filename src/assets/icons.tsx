import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

import help from '@/assets/svg/help.svg';
import home from '@/assets/svg/home.svg';
import toggleSideBar from '@/assets/svg/toggle-sidebar.svg';
import { Loader2 } from 'lucide-react';
import alignJustify from './svg/align-justify.svg';
import arrowRight from './svg/arrowRight.svg';
import calendar from './svg/calendar.svg';
import cart from './svg/cart.svg';
import chevronDown from './svg/chevron-down.svg';
import closeEye from './svg/close-eye.svg';
import close from './svg/close.svg';
import copy from './svg/copy.svg';
import csv from './svg/csv.svg';
import docs from './svg/docs.svg';
import download from './svg/download.svg';
import eyeOff from './svg/eye-off.svg';
import infoCircle from './svg/infoCircle.svg';
import loading from './svg/loading.svg';
import lockOpen from './svg/lock-open.svg';
import logoNoDesc from './svg/logo-no-desc.svg';
import logo from './svg/logo.svg';
import logout from './svg/logout.svg';
import noDataTable from './svg/no-data-table.svg';
import noData from './svg/no-data.svg';
import openEye from './svg/open-eye.svg';
import pdf from './svg/pdf.svg';
import pen from './svg/pen.svg';
import plus from './svg/plus.svg';
import save from './svg/save.svg';
import search from './svg/search.svg';
import spin from './svg/spin.svg';
import star from './svg/star.svg';
import trash from './svg/trash.svg';
import twitter from './svg/twitter.svg';
import upload from './svg/upload.svg';
import userCircle from './svg/user-circle.svg';
import user from './svg/user.svg';
import wallet from './svg/wallet.svg';
import xCircle from './svg/x-circle.svg';
import X from './svg/x.svg';
import xlsx from './svg/xlsx.svg';
import lightning from './svg/lightning.svg';

const IconList = {
  lightning,
  cart,
  home,
  help,
  toggleSideBar,
  logoNoDesc,
  infoCircle,
  download,
  noData,
  upload,
  docs,
  eyeOff,
  csv,
  pdf,
  xlsx,
  chevronDown,
  twitter,
  trash,
  pen,
  plus,
  copy,
  save,
  loading,
  arrowRight,
  X,
  logo,
  close,
  user,
  lockOpen,
  openEye,
  closeEye,
  search,
  noDataTable,
  star,
  userCircle,
  logout,
  spin,
  alignJustify,
  calendar,
  xCircle,
  wallet,
  spinner: Loader2,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
