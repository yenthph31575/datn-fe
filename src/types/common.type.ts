// export interface IPaging {
//   page?: number;
//   limit?: number;
//   total_page: number;
//   total_item: number;
// }

import type { IPagination } from '.';

export interface IAxiosResponse<T> {
  data: T;
  message?: string;
  pagination?: IPagination;
}

export interface ObjectLiteral<T = string> {
  [s: string]: T;
}
