'use client';

import { useProductReviewsQuery } from '@/api/reviews/queries';
import type { IReview, IReviewQueryParams } from '@/api/reviews/types';
import Tabs from '@/components/tabs/Tabs';
import { Rating } from '@/components/ui/rating';
import { TablePagination } from '@/components/ui/table';
import { HStack, Show, VStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCommentProps {
  productId: string;
}

const ITEMS_PER_PAGE = 5;

const ProductComment = ({ productId }: ProductCommentProps) => {
  const [activeTab, setActiveTab] = useState('all');

  // Query params for the API
  const [queryParams, setQueryParams] = useState<Partial<IReviewQueryParams>>({
    page: 1,
    limit: 10,
    rating: activeTab !== 'all' ? parseInt(activeTab) : undefined,
  });

  // Use the query hook to fetch reviews from the API endpoint
  const { data, isLoading } = useProductReviewsQuery({
    variables: { ...queryParams, productId },
    enabled: Boolean(productId),
    onError: onMutateError,
    keepPreviousData: true,
  });

  // Extract reviews and stats from the response
  const reviews = data?.items || [];
  const ratingStats = data?.ratingStats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
  };
  const pagination = data?.meta || {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
  };

  // Create rating counts array from distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: (ratingStats.ratingDistribution as any)[rating as any] || 0,
    percentage:
      ratingStats.totalReviews > 0
        ? Math.round(((ratingStats.ratingDistribution as any)[rating as any] / ratingStats.totalReviews) * 100)
        : 0,
  }));

  const tabOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: '5', value: '5', icon: <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> },
    { label: '4', value: '4', icon: <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> },
    { label: '3', value: '3', icon: <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> },
    { label: '2', value: '2', icon: <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> },
    { label: '1', value: '1', icon: <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> },
  ];

  return (
    <div className="mt-8">
      <h2 className="mb-6 font-bold text-2xl">Đánh giá sản phẩm</h2>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Rating summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="font-bold text-5xl">{ratingStats.averageRating.toFixed(1)}</div>
            <Rating value={Math.round(ratingStats.averageRating)} readOnly size="md" className="mt-2 justify-center" />
            <div className="mt-1 text-gray-500 text-sm">{ratingStats.totalReviews} đánh giá</div>
          </div>

          <div className="mt-6 space-y-3">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="w-12 text-sm">{rating} stars</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                </div>
                <div className="w-8 text-right text-gray-500 text-sm">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-auto">
              <Tabs
                data={tabOptions}
                value={activeTab}
                onChange={(value: any) => {
                  setActiveTab(value.toString());
                  setQueryParams((prev) => ({ ...prev, page: 1, rating: value !== 'all' ? parseInt(value) : undefined }));
                }}
                layoutId="review-tabs"
                className="overflow-x-auto"
                activeTabClassName="bg-primary-50"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <TablePagination pagination={data?.meta} onPageChange={(page) => setQueryParams((prev) => ({ ...prev, page }))} />
              </div>
            </>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center text-gray-500">
              <div className="font-medium text-lg">Chưa có đánh giá nào</div>
              <p className="mt-2">Bạn là người đầu tiên đánh giá sản phẩm này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReviewItemProps {
  review: IReview;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <HStack pos="apart">
        <HStack spacing={12}>
          <Image
            width={40}
            height={40}
            src={review.user?.avatar || '/images/no-image.svg'}
            alt={review.user?.username || 'User'}
            className="h-10 w-10"
          />
          <VStack spacing={4}>
            <span className="font-medium">{review.user?.username || 'Anonymous'}</span>
            <Rating value={review.rating} readOnly size="sm" />
          </VStack>
        </HStack>
        <div className="text-gray-500 text-sm">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</div>
      </HStack>

      <div className="mt-4">{review.comment}</div>

      <Show when={review.images && review.images.length > 0}>
        <div className="mt-4 flex flex-wrap gap-2">
          {review.images.map((image, index) => (
            <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md">
              <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </Show>

      {/* <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {review.isPurchased && <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">Đã mua hàng</span>}
          {review.isVerified && <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">Đã xác thực</span>}
        </div>
      </div> */}
    </div>
  );
};

export default ProductComment;
