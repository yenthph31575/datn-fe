import { cn } from '@/libs/common';
import { User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Rating } from './rating';
import { format } from 'date-fns';

export interface ReviewProps {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  helpful?: number;
  verified?: boolean;
}

interface ReviewCardProps {
  review: ReviewProps;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const { userName, userAvatar, rating, comment, date, images = [], helpful = 0, verified = false } = review;

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-4 shadow-sm', className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {userAvatar ? (
            <Image src={userAvatar} alt={userName} width={40} height={40} className="rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900">{userName}</h4>
              <div className="mt-1 flex items-center gap-2">
                <Rating value={rating} size="sm" readOnly />
                <span className="text-gray-500 text-xs">{format(date, 'dd/MM/yyyy')}</span>
                {verified && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 text-xs">Verified Purchase</span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-gray-700 text-sm">{comment}</p>

          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {helpful > 0 && (
            <div className="mt-3 text-gray-500 text-xs">
              {helpful} {helpful === 1 ? 'person' : 'people'} found this review helpful
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ReviewCard };
