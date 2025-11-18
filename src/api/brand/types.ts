import type { IMetaResponse, ITableQuery } from './../../types/index';

export interface IBrandQuery extends ITableQuery {}

export interface IBrand {
  _id: string;
  name: string;
  description: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface IBrandResponse {
  items: IBrand[];
  meta: IMetaResponse;
}
