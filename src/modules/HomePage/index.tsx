'use client';
import { VStack } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import React from 'react';
import AvailableVouchers from './components/AvailableVouchers';
import Banner from './components/Banner';
import Brand from './components/Brand';
import Category from './components/Category';
import FeaturedProducts from './components/FeaturedProducts';
import NewArrivals from './components/NewArrivals';
import ProductBestSeller from './components/ProductBestSeller';

const HomePage = () => {
  return (
    <main
      className="flex flex-col gap-12 pb-10"
      style={{
        backgroundImage: 'url(https://mykingdom.com.vn/cdn/shop/files/12._Background_trang_ch_-_1440x1080_2.webp?v=1764305251)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Banner />

      <Category />

      <NewArrivals />

      <ProductBestSeller />

      <AvailableVouchers />

      <Brand />

      <FeaturedProducts />
    </main>
  );
};

export default HomePage;
