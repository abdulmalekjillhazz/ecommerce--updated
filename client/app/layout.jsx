import './globals.css';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import CartDrawer from '../components/cart/CartDrawer.jsx';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ShopSphere | Premium Consumer Electronics & Gadgets Store',
    template: '%s | ShopSphere Official',
  },
  description:
    'Discover genuine electronics, noise-cancelling headphones, wireless earbuds, smartwatches, and mechanical keyboards with fast nationwide delivery and warranty.',
  keywords: [
    'Electronics Store',
    'Wireless Headphones',
    'Sony WH-1000XM5',
    'AirPods Pro',
    'Smartwatches',
    'Mechanical Keyboards',
    'Online Shopping Bangladesh',
    'Authentic Gadgets',
  ],
  authors: [{ name: 'ShopSphere' }],
  creator: 'ShopSphere',
  publisher: 'ShopSphere Commerce',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'ShopSphere',
    title: 'ShopSphere | Premium Consumer Electronics Store',
    description:
      'Buy original premium electronics and tech accessories. Free delivery over $200.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'ShopSphere Electronics Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopSphere | Premium Consumer Electronics Store',
    description: 'Buy original premium electronics and tech accessories with warranty.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630'],
  },
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'ShopSphere',
    url: 'http://localhost:3000',
    description: 'Premier e-commerce destination for authentic electronics and tech accessories.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'http://localhost:3000/products?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
