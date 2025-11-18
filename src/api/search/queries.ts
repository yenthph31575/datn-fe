import { createQuery } from 'react-query-kit';
import { type ISearchResponse, searchProducts } from './requests';

export const useSearchQuery = createQuery<ISearchResponse, string>({
  queryKey: ['search'],
  fetcher: (query) => searchProducts(query),
});
