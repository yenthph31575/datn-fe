'use client';

import { HStack } from '@/components/utilities';
import Image from 'next/image';
import React from 'react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
const Banner = () => {
  const sliders = [
    { image: 'https://mykingdom.com.vn/cdn/shop/files/mkd_size_1280_496.png?v=1745988888&width=1200' },
    { image: 'https://mykingdom.com.vn/cdn/shop/files/1._1280x496_9fb1a822-6277-4796-b7ac-92bf2a3f607c.jpg?v=1745916141&width=1200' },
    { image: 'https://mykingdom.com.vn/cdn/shop/files/1._1280x496_14526ed1-0e57-45fb-aef4-c04dc427f753.png?v=1745311794&width=1200' },
  ];
  return (
    <div>
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
    </div>
  );
};

export default Banner;
