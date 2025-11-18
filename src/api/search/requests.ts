import client from '../axios';

export interface ISearchProduct {
  _id: string;
  name: string;
  images: string[];
  originalPrice: number;
  currentPrice: number;
  slug: string;
  primaryCategory: any;
  brand: {
    _id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ISearchResponse {
  items: ISearchProduct[];
  total: number;
}

export const searchProducts = async (query: string): Promise<ISearchResponse> => {
  const { data } = await client({
    url: '/api/search',
    method: 'GET',
    params: { query },
  });
  return data?.data?.products;
};
