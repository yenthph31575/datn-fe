import { HStack, VStack } from '@/components/utilities';
import { ROUTER } from '@/libs/router';
import { Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-32 bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About */}
          <div>
            <Link href={ROUTER.HOME}>
              <Image src="/images/logo.png" alt="logo" width={150} height={92} />
            </Link>
            <p className="mt-4 text-gray-600 text-sm">Your trusted online marketplace for quality products and exceptional service.</p>
            <HStack className="mt-6" spacing={16}>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-primary-600" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-primary-600" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-primary-600" />
              </Link>
            </HStack>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Quick Links</h3>
            <VStack spacing={12} align="start">
              <Link href={ROUTER.HOME} className="text-gray-600 hover:text-primary-600">
                Home
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary-600">
                Products
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600">
                Contact
              </Link>
            </VStack>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Customer Service</h3>
            <VStack spacing={12} align="start">
              <Link href="/faq" className="text-gray-600 hover:text-primary-600">
                FAQ
              </Link>
              <Link href="/shipping" className="text-gray-600 hover:text-primary-600">
                Shipping Policy
              </Link>
              <Link href="/returns" className="text-gray-600 hover:text-primary-600">
                Returns & Refunds
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-primary-600">
                Privacy Policy
              </Link>
            </VStack>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Contact Us</h3>
            <VStack spacing={12} align="start">
              <HStack spacing={8}>
                <Mail className="h-5 w-5 text-primary-600" />
                <span className="text-gray-600">support@example.com</span>
              </HStack>
              <HStack spacing={8}>
                <Phone className="h-5 w-5 text-primary-600" />
                <span className="text-gray-600">+1 (123) 456-7890</span>
              </HStack>
              <p className="text-gray-600">
                123 Commerce Street
                <br />
                City, State 12345
              </p>
            </VStack>
          </div>
        </div>

        <div className="mt-12 border-gray-300 border-t pt-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <HStack spacing={16}>
                <Link href="/terms" className="text-gray-600 text-sm hover:text-primary-600">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-gray-600 text-sm hover:text-primary-600">
                  Privacy Policy
                </Link>
              </HStack>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
