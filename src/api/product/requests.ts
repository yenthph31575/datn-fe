import client from '../axios';
import type { IProduct, IProductQuery, IProductResponse } from './types';

export const getProducts = async (params: Partial<IProductQuery>): Promise<IProductResponse> => {
  const { data } = await client({
    url: '/api/products',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getProductByIdOrSlug = async (id: string): Promise<IProduct> => {
  const { data } = await client({
    url: `/api/products/${id}`,
    method: 'GET',
  });
  return data?.data;
};

export const getProductBySlug = async (slug: string): Promise<IProduct> => {
  const { data } = await client({
    url: `/api/products/slug/${slug}`,
    method: 'GET',
  });
  return data?.data;
};

export const getProductsBestSeller = async (params: Partial<IProductQuery>): Promise<IProductResponse> => {
  const { data } = await client({
    url: '/api/products/best-sellers',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getProductsRelated = async ({
  params,
  productId,
}: { params: Partial<IProductQuery>; productId: string }): Promise<IProductResponse> => {
  const { data } = await client({
    url: `/api/products/${productId}/related`,
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getProductsNewArrivals = async (params: Partial<IProductQuery>): Promise<IProductResponse> => {
  const { data } = await client({
    url: '/api/products/new-arrivals',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getProductsFeatured = async (params: Partial<IProductQuery>): Promise<IProductResponse> => {
  const { data } = await client({
    url: '/api/products/featured',
    method: 'GET',
    params,
  });
  return data?.data;
};
