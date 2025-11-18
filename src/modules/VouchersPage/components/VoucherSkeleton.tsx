const VoucherSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Voucher header skeleton */}
      <div className="relative bg-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-300"></div>
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300"></div>
        </div>
        <div className="mt-1 h-4 w-48 animate-pulse rounded bg-gray-300"></div>

        {/* Tear effect */}
        <div className="absolute right-0 bottom-0 left-0 h-4 overflow-hidden">
          <div className="flex w-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded-full bg-white" style={{ marginLeft: '-8px' }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Voucher content skeleton */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
        </div>

        <div className="mb-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Voucher code skeleton */}
        <div className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-2">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export default VoucherSkeleton;
