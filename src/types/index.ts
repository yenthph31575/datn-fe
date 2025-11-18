import type { FC, PropsWithChildren, SVGProps } from 'react';

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ErrorMutate {
  code: number;
  error_code?: string;
  message: string | string[];
  dynamic_data?: {};
}
export interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface ITableQuery {
  page: number;
  limit: number;
  sortKey: string;
  sortValue: string;
  search: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total_page: number;
  total_item: number;
  current_page: number;
}
export interface IMetaResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
