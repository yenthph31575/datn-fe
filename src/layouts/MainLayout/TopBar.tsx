'use client';

import { HStack } from '@/components/utilities';
import { ROUTER } from '@/libs/router';
import { Clock, MapPin, Phone, Truck, Zap } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const TopBar = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const promos = [
    { icon: <Zap className="h-4 w-4 text-yellow-300" />, text: 'Flash Sale! 24 hours only - Up to 70% OFF' },
    { icon: <Truck className="h-4 w-4 text-blue-300" />, text: 'Free shipping on orders over $50' },
    { icon: <Clock className="h-4 w-4 text-green-300" />, text: 'Limited time offer - Buy 2 Get 1 Free' },
  ];

  useEffect(() => {
    // Animation effect for text change
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentPromo((prev) => (prev + 1) % promos.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [promos.length]);

  return (
    <div className="relative bg-gray-900 py-2 text-white text-xs">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <HStack pos="apart">
          {/* Left side - Animated Promotion */}
          <div className="hidden overflow-hidden md:block">
            <div
              className={`flex items-center transition-all duration-500 ${
                isVisible ? 'transform-none opacity-100' : '-translate-y-4 opacity-0'
              }`}
            >
              <div className="mr-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-primary-600">
                {promos[currentPromo].icon}
              </div>
              <span className="font-medium">{promos[currentPromo].text}</span>
            </div>
          </div>

          {/* Mobile promotion */}
          <div className="relative overflow-hidden md:hidden">
            <div className="animate-marquee-fast whitespace-nowrap">
              {promos.map((promo, index) => (
                <span key={index} className="mr-8 inline-flex items-center">
                  <span className="mr-1 inline-block">{promo.icon}</span> {promo.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right side - Contact & Store info */}
          <HStack spacing={16}>
            <HStack spacing={6}>
              <Phone className="h-3.5 w-3.5 animate-bounce-slow" />
              <a href="tel:+1234567890" className="transition-colors hover:text-primary-300">
                +1 (234) 567-890
              </a>
            </HStack>
            <HStack spacing={6}>
              <MapPin className="h-3.5 w-3.5 animate-pulse" />
              <Link href={ROUTER.HOME} className="transition-colors hover:text-primary-300">
                Find a Store
              </Link>
            </HStack>
          </HStack>
        </HStack>
      </div>
    </div>
  );
};

export default TopBar;
