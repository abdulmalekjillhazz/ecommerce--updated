import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient.jsx';

// Fetch product helper for SSR & Metadata
async function getProduct(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching product for slug:', slug, error);
    return null;
  }
}

// Next.js dynamic SEO metadata generation
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | ShopSphere',
      description: 'The requested product could not be located in our store catalog.',
    };
  }

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/products/${product.slug}`;

  return {
    title: product.metaTitle || `${product.name} | ShopSphere Official`,
    description: product.metaDescription || product.shortDescription,
    keywords: product.keywords || [product.name, product.brand, product.category],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org Product Structured Data for Google Rich Snippets
  const price = product.discountPrice || product.price;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.url) || [],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `http://localhost:3000/products/${product.slug}`,
      priceCurrency: 'USD',
      price: price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.ratingsAverage || 5,
      reviewCount: product.ratingsCount || 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
