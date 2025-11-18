'use client';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/utilities';
import { useMobile } from '@/hooks/breakpoint';
import { useUserLogin } from '@/hooks/useUserLogin';
import { cn } from '@/libs/common';
import { ROUTER } from '@/libs/router';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cart from './Cart';
import SearchComponent from './SearchComponent';
import UserInfo from './UserInfo';

const Header = () => {
  const isMobile = useMobile();
  const { user, isLoggedIn } = useUserLogin();
  const router = useRouter();

  const handleOrdersClick = () => {
    if (!isLoggedIn) {
      toast.info('Please sign in to view your orders');
      router.push(ROUTER.SIGN_IN);
      return;
    }
    router.push(ROUTER.ORDERS);
  };

  return (
    <header
      className={cn(
        'sticky top-0 right-0 z-40 w-full bg-primary-600 px-4 py-3 text-white shadow-header lg:px-8',
        !isMobile && ' h-header '
      )}
    >
      <HStack className="mx-auto max-w-[1440px]" pos="apart" spacing={isMobile ? 20 : 48}>
        <Link href={ROUTER.HOME}>
          <Image src="/images/logo.png" alt="logo" width={150} height={92} className="h-auto w-[95px]" />
        </Link>

        <HStack className="flex-1">
          <SearchComponent />
        </HStack>

        <HStack pos="right" spacing={isMobile ? 4 : 16} className="">
          <Button variant="transparent" className="relative hidden lg:flex" onClick={handleOrdersClick}>
            <Package className="text-white" />
            <span className="ml-3">Orders</span>
          </Button>

          <Cart />

          {!user ? (
            <Link href={ROUTER.SIGN_IN}>
              <Button className="rounded-full">Sign In</Button>
            </Link>
          ) : (
            <UserInfo />
          )}
        </HStack>
      </HStack>
    </header>
  );
};

export default Header;
