'use client';

import { useSearchQuery } from '@/api/search/queries';
import H5 from '@/components/text/H5';
import { Input } from '@/components/ui/input';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { debounce } from 'lodash';
import { Loader2, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sử dụng query với enabled: false để chỉ fetch khi cần
  const { data, isFetching, refetch } = useSearchQuery({
    variables: searchTerm,
    enabled: false || !searchTerm,
  });

  // Xử lý click outside để đóng kết quả tìm kiếm
  useOnClickOutside(containerRef as any, () => setIsOpen(false));

  // Tạo hàm debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim().length > 1) {
        refetch({ queryKey: ['search', term] });
      }
    }, 500),
    [refetch]
  );

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 1) {
      debouncedSearch(value);
    }
  };

  // Xử lý click vào input
  const handleInputClick = () => {
    setIsOpen(true);
  };

  // Xử lý clear input
  const handleClearSearch = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // router.push(`${ROUTER.items}?search=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Cleanup debounce khi unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div ref={containerRef} className="relative w-full lg:mr-10 xl:mr-24">
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          className="h-11 w-full max-w-[500px] rounded-full bg-white pr-10 pl-10 text-black"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button onClick={handleClearSearch} className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 hover:text-gray-600">
            {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full right-0 left-0 z-50 mt-1 max-w-[500px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <H5 className=" p-2 font-poppins text-grey-600">Search Result</H5>
          {isFetching ? (
            <div className="flex h-20 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="max-h-[350px] min-h-[250px] overflow-y-auto">
              {data.items.map((product) => (
                <Link
                  key={product._id}
                  href={`${ROUTER.PRODUCTS}/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-primary-100"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-grey-600 text-sm">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-primary-600 text-sm">{formatNumber(product.currentPrice)}</p>
                      {product.originalPrice > product.currentPrice && (
                        <p className="text-gray-400 text-xs line-through">{formatNumber(product.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* {data.total > data.items.length && (
                <div className="border-t px-4 py-2">
                  <Link
                    href={`${ROUTER.}?search=${encodeURIComponent(searchTerm)}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-primary-600 text-sm hover:underline"
                  >
                    View all {data.total} results
                  </Link>
                </div>
              )} */}
            </div>
          ) : searchTerm.trim().length > 1 ? (
            <div className="flex h-20 flex-col items-center justify-center">
              <p className="text-gray-500">No products found</p>
              <p className="text-gray-400 text-sm">Try different keywords</p>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center">
              <p className="text-gray-500">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
