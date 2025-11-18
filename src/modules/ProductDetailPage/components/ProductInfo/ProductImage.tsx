import { HStack } from '@/components/utilities';
import Image from 'next/image';
import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { ProductInfoProps } from '.';

const ProductImage = ({ images = [] }: ProductInfoProps) => {
  const [activeSlide, setActiveSlide] = useState(0); // Dùng để lưu trữ slide đang active

  const handleThumbnailClick = (index: number) => {
    setActiveSlide(index); // Cập nhật slide đang active khi click vào thumbnail
  };

  const pagination = {
    clickable: true,
    renderBullet: (index: number, className: string) => {
      const imageUrl = images[index];
      return `
        <div class="${className}" style="width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; margin: 5px;">
          <img src="${imageUrl}" alt="Slide ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
        </div>
      `;
    },
  };

  return (
    <div>
      <Swiper
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
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <HStack pos="center">
              <Image src={item} alt={`Slide ${index + 1}`} className="w-full rounded-lg" width={500} height={500} />
            </HStack>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImage;
