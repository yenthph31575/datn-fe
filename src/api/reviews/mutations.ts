import { createMutation } from 'react-query-kit';
import { submitReview } from './requests';
import type { IReview, IReviewRequest } from './types';

export const useSubmitReviewMutation = createMutation<IReview, IReviewRequest>({
  mutationKey: ['reviews/submit'],
  mutationFn: (data) => submitReview(data),
});
