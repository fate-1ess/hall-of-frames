import { notFound } from "next/navigation";

import products from "@/products";
import { findProductBySlug, generateSlug, getRelatedProducts } from "@/utils";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((product) => ({ slug: generateSlug(product.name) }));
}

export const dynamicParams = false;

const ProductDetailPage = ({ params }) => {
  const slug = params?.slug;
  const product = findProductBySlug(products, slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(products, product);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
};

export default ProductDetailPage;
