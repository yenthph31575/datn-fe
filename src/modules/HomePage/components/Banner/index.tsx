'use client';

import { HStack } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import Image from 'next/image';
import React from 'react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
const Banner = () => {
  const sliders = [
    { image: 'https://mykingdom.com.vn/cdn/shop/files/1._1280x496_3cba42d7-32c1-48e0-83fd-5f66eb74724e.png?v=1764520675&width=1200' },
    { image: 'https://mykingdom.com.vn/cdn/shop/files/1280_x_496_22340f1f-527a-4e1a-9a7d-3cca16bd91e3.jpg?v=1764521656&width=1200' },
    {
      image:
        'https://mykingdom.com.vn/cdn/shop/files/header_banner_1280x496_c1a610e8-1a7a-4737-af85-609019a662af.jpg?v=1762528195&width=1200',
    },
  ];
  return (
    <div className="mt-8">
      <Container>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          onSlideChange={() => console.log('slide change')}
        >
          {sliders?.map((item, index) => (
            <SwiperSlide key={index}>
              <HStack pos="center">
                <Image src={item.image || ''} alt="" className="w-full rounded-lg" width={1200} height={465} />
              </HStack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default Banner;
