import { getProductByIdOrSlug } from '@/api/product/requests';
import Breadcrumb from '@/components/Breadcrumb';
import H2 from '@/components/text/H2';
import H3 from '@/components/text/H3';
import Container from '@/components/wrapper/Container';
import React from 'react';
import ProductComment from './components/ProductComment';
import ProductDetail from './components/ProductDetail';
import ProductInfo from './components/ProductInfo';
import ProductRelated from './components/ProductRelated';
import { ROUTER } from '@/libs/router';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const ProductDetailPage = async ({ params }: Props) => {
  const slug = (await params).slug;
  const data = await getProductByIdOrSlug(slug);

  return (
    <div>
      <Breadcrumb
        breadcrumbs={[{ name: 'Home', path: ROUTER.HOME }, { name: 'Product', path: ROUTER.COLLECTIONS }, { name: data?.name }]}
      />

      <Container className="mt-10">
        <ProductInfo {...data} />

        <ProductDetail {...data} />

        <div className="mt-10">
          <H2 className="font-orbitron">Mô tả sản phẩm</H2>
          <H3 className="my-4 font-poppins">{data?.name}</H3>

          <div className="text-base" dangerouslySetInnerHTML={{ __html: data?.description || '' }}></div>
        </div>

        <ProductComment productId={data?._id} />

        <ProductRelated productId={data?._id} />
      </Container>
    </div>
  );
};

export default ProductDetailPage;
