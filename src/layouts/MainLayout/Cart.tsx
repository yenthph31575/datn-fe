'use client';

import { useCartQuery } from '@/api/cart/queries';
import { Icons } from '@/assets/icons';
import H3 from '@/components/text/H3';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { HStack, VStack } from '@/components/utilities';
import { useUserLogin } from '@/hooks/useUserLogin';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { useCartStore } from '@/stores/CartStore';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const Cart = () => {
  const { carts, mergeCart, removeFromCart } = useCartStore();
  const { user } = useUserLogin();

  // Calculate total price
  const totalPrice = carts.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fetch cart from API if user is logged in
  const { data: cartData } = useCartQuery({
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data?.items?.length) {
        useCartStore.getState().setCart(data.items);
      }
    },
  });

  // Merge local cart with server cart when user logs in
  useEffect(() => {
    if (user?.id && carts.length > 0) {
      mergeCart();
    }
  }, [user?.id]);

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href={ROUTER.CART}>
          <Button variant="transparent" className="relative">
            <Icons.cart className="text-white" />
            <span className="ml-3 hidden lg:flex">Giỏ hàng</span>
            <div className="-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary-500 text-xs">
              {carts?.length || 0}
            </div>
          </Button>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-4" align="end">
        <div className="mb-2 flex items-center justify-between">
          <H3 className="text-primary-600">Giỏ hàng</H3>
        </div>

        <Separator className="mb-3" />

        {carts.length === 0 ? (
          <VStack spacing={4} className="py-6 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <H3 className="text-center font-semibold text-gray-500">Giỏ hàng của bạn đang trống</H3>
            <Link href={ROUTER.COLLECTIONS}>
              <Button className="mt-2 w-full">Tiếp tục mua hàng</Button>
            </Link>
          </VStack>
        ) : (
          <>
            <VStack className="max-h-60 overflow-y-auto" spacing={4}>
              {carts.map((item) => (
                <div key={item._id} className="flex w-full items-start gap-2 py-2">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-100">
                    {item.image && <img src={item.image} alt={item.name} className="h-full w-full rounded-md object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <span>Qty: {item.quantity}</span>
                      {Object.values(item.attributes || {}).length > 0 && (
                        <span className="truncate">{Object.values(item.attributes || {}).join(', ')}</span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold text-sm">{formatNumber(item.price)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeFromCart(item._id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </VStack>

            <Separator className="my-3" />

            <HStack pos="apart" className="mb-3">
              <span className="font-medium text-sm">Tổng tiền:</span>
              <span className="font-bold text-sm">{formatNumber(totalPrice)}</span>
            </HStack>

            <Link href={ROUTER.CART} className="w-full ">
              <Button variant="outline" className="w-full">
                Xem giỏ hàng
              </Button>
            </Link>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default Cart;
