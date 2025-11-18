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
    <Container className="mt-10">
      <VStack spacing={48}>
        <Banner />

        <Category />

        <NewArrivals />

        <ProductBestSeller />

        <AvailableVouchers />

        <Brand />

        <FeaturedProducts />
      </VStack>
    </Container>
  );
};

export default HomePage;
