import type { IMetaResponse } from '../../types';

export interface ICartItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  attributes: Record<string, string>;
  totalQuantity: number;
}

export interface ICartResponse {
  items: ICartItem[];
  meta: IMetaResponse;
}

export interface IAddToCartRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface IUpdateCartRequest {
  cartItemId: string;
  quantity: number;
}

export interface IMergeCartRequest {
  items: IAddToCartRequest[];
}
