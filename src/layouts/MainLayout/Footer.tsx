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
              <Image src="/images/logo.png" alt="logo" width={150} height={92} priority />
            </Link>
            <p className="mt-4 text-gray-600 text-sm">Nền tảng mua sắm trực tuyến uy tín với sản phẩm chất lượng và dịch vụ tận tâm.</p>
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
            <h3 className="mb-4 font-semibold text-lg">Liên kết nhanh</h3>
            <VStack spacing={12} align="start">
              <Link href={ROUTER.HOME} className="text-gray-600 hover:text-primary-600">
                Trang chủ
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary-600">
                Sản phẩm
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600">
                Về chúng tôi
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600">
                Liên hệ
              </Link>
            </VStack>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Hỗ trợ khách hàng</h3>
            <VStack spacing={12} align="start">
              <Link href="/faq" className="text-gray-600 hover:text-primary-600">
                Câu hỏi thường gặp
              </Link>
              <Link href="/shipping" className="text-gray-600 hover:text-primary-600">
                Chính sách vận chuyển
              </Link>
              <Link href="/returns" className="text-gray-600 hover:text-primary-600">
                Đổi trả & Hoàn tiền
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-primary-600">
                Chính sách bảo mật
              </Link>
            </VStack>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Liên hệ</h3>
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
                123 Đường Thương Mại
                <br />
                Thành phố, Bang 12345
              </p>
            </VStack>
          </div>
        </div>

        <div className="mt-12 border-gray-300 border-t pt-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Tên Công Ty Của Bạn. Mọi quyền được bảo lưu.</p>
            <div className="mt-4 md:mt-0">
              <HStack spacing={16}>
                <Link href="/terms" className="text-gray-600 text-sm hover:text-primary-600">
                  Điều khoản dịch vụ
                </Link>
                <Link href="/privacy" className="text-gray-600 text-sm hover:text-primary-600">
                  Chính sách bảo mật
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
