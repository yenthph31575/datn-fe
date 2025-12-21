'use client';

import { ROUTER } from '@/libs/router';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <section>
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-6 py-12">
        <div>
          <p className="font-medium text-main text-sm">Lỗi 404</p>
          <h1 className="mt-3 font-semibold text-2xl md:text-3xl">Không tìm thấy trang bạn yêu cầu</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>

          <div className="mt-6 flex items-center gap-x-3">
            <button
              onClick={router.back}
              className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-100 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 rtl:rotate-180"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>

              <span>Quay lại</span>
            </button>

            <Link
              href={ROUTER.HOME}
              className="w-1/2 shrink-0 rounded-lg bg-primary-600 px-5 py-2 text-sm text-white tracking-wide transition-colors duration-200 hover:bg-primary-700 sm:w-auto"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
