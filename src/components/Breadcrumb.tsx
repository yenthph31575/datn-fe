import { cn } from '@/libs/common';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import Container from './wrapper/Container'; // Giả sử bạn có một Container component

type BreadcrumbItem = {
  name: string;
  path?: string;
};

type Props = {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
};

const Breadcrumb = ({ breadcrumbs, className }: Props) => {
  return (
    <div>
      <section className={cn('bg-[#F2F2F2] py-2', className)}>
        <Container className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {breadcrumb.path ? (
                <Link href={breadcrumb.path} className="text-grey-500">
                  {breadcrumb.name}
                </Link>
              ) : (
                <span className="text-grey-500">{breadcrumb.name}</span>
              )}

              {index < breadcrumbs.length - 1 && <ChevronRight className="w-5 text-grey-600" />}
            </React.Fragment>
          ))}
        </Container>
      </section>
    </div>
  );
};

export default Breadcrumb;
