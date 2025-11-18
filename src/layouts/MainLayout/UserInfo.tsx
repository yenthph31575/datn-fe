'use client';

import { userLogout } from '@/api/auth/requests';
import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HStack, VStack } from '@/components/utilities';
import { useUserLogin } from '@/hooks/useUserLogin';
import UserProfileDialog from '@/layouts/MainLayout/UserProfileDialog';
import { ROUTER } from '@/libs/router';
import { useUserStore } from '@/stores/UserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';
import { Heart, Package, ShoppingBag, Ticket } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-toastify';

const UserInfo = () => {
  const { user } = useUserLogin();
  const { logout } = useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation(userLogout);

  const handleLogout = async () => {
    // mutate(undefined, {
    //   onSuccess: () => {
    router.replace(ROUTER.SIGN_IN);
    queryClient.clear();
    logout();
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    localStorage.clear();
    toast.success('Đăng xuất thành công!');
    //   },
    //   onError: onMutateError,
    // });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <HStack spacing={12}>
              <Image src={user?.avatar || '/images/no-image.svg'} alt="Avatar" width={56} height={56} className="h-7 w-7 rounded-full" />
              <span className="hidden lg:flex">{user?.username || '--'}</span>

              <Icons.chevronDown />
            </HStack>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="flex w-64 flex-col gap-4 p-4">
          <VStack spacing={16}>
            <HStack spacing={20} noWrap>
              <Image src={user?.avatar || '/images/no-image.svg'} alt="Avatar" width={40} height={40} className="h-10 w-10 rounded-full" />

              <VStack className="text-base">
                <span className="font-medium">{user?.username || '--'}</span>
                <span className="text-gray-500 text-sm">{user?.email || '--'}</span>
              </VStack>
            </HStack>

            <UserProfileDialog />
          </VStack>

          <div className="grid gap-2 pt-2">
            <Link href={ROUTER.ORDERS}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700">
                <Package className="h-4 w-4" />
                Đơn hàng của tôi
              </Button>
            </Link>

            <Link href={ROUTER.FAVORITES}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700">
                <Heart className="h-4 w-4" />
                Sản phẩm yêu thích
              </Button>
            </Link>

            <Link href={ROUTER.VOUCHERS}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700">
                <Ticket className="h-4 w-4" />
                Vouchers
              </Button>
            </Link>

            <Link href={ROUTER.CART}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700">
                <ShoppingBag className="h-4 w-4" />
                Giỏ hàng
              </Button>
            </Link>
          </div>

          <div className="pt-2">
            <Button className="w-full items-center gap-2" size="sm" onClick={handleLogout}>
              <Icons.logout />
              Đăng xuất
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserInfo;
